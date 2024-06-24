import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CForm,
  CCol,
  CFormLabel,
  CInputGroup,
  CFormInput,
  CFormSelect,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [jobs, setJobs] = useState([]);
  const [generateBody, setGenerateBody] = useState({
    username: "",
    templateName: "",
    data: {
      name: "",
    },
  });
  const apiUrl = "http://localhost:3000/api";

  useEffect(() => {
    (async () => {
      const jobs = await axios.get(`${apiUrl}/jobs`);
      const jobsData = jobs.data;

      setJobs(jobsData);
    })();
  }, []);

  const handleChange = (e: any) => {
    const value = e.target.value;
    setGenerateBody({
      ...generateBody,
      [e.target.name]: value,
    });
  };

  const handleChangeData = (e: any) => {
    const value = e.target.value;
    setGenerateBody({
      ...generateBody,
      data: {
        ...generateBody.data,
        [e.target.name]: value,
      },
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const userData = {
      username: "alvin",
      templateName: generateBody.templateName,
      data: {
        name: generateBody.data.name,
      },
    };
    await axios.post(`${apiUrl}/generate`, userData);
  };

  const handleSubmitDownload = async (filename: string) => {
    // e.preventDefault();
    const userData = {
      templateName: filename,
    };
    const response = await axios.post(`${apiUrl}/download`, userData, {
      responseType: "blob",
    });

    // Create a Blob from the response data
    const pdfBlob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(pdfBlob);

    // Create a temporary <a> element to trigger the download
    const tempLink = document.createElement("a");
    tempLink.href = url;
    tempLink.setAttribute("download", filename); // Set the desired filename for the downloaded file

    // Append the <a> element to the body and click it to trigger the download
    document.body.appendChild(tempLink);
    tempLink.click();

    // Clean up the temporary elements and URL
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(url);
  };

  return (
    <main>
      <CForm className="row row-cols-lg-auto g-3 align-items-center">
        <CCol xs="auto">
          <CFormLabel
            className="visually-hidden"
            htmlFor="inlineFormInputGroupUsername"
          >
            Username
          </CFormLabel>
          <CInputGroup>
            <CFormInput
              id="inlineFormInputGroupUsername"
              placeholder="Your Name"
              name="name"
              onChange={handleChangeData}
            />
          </CInputGroup>
        </CCol>

        <CCol xs="auto">
          <CFormLabel
            className="visually-hidden"
            htmlFor="inlineFormSelectPref"
          >
            Preference
          </CFormLabel>
          <CFormSelect
            id="inlineFormSelectPref"
            name="templateName"
            onChange={handleChange}
          >
            <option value="template-1">template-1</option>
            <option value="template-2">template-2</option>
          </CFormSelect>
        </CCol>
        <CCol xs="auto">
          <CButton color="primary" variant="outline" onClick={handleSubmit}>
            Generate
          </CButton>
        </CCol>
      </CForm>

      <CTable striped>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Filename</CTableHeaderCell>
            <CTableHeaderCell scope="col">status</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {jobs.map((item: any) => (
            <CTableRow key={item.id}>
              <CTableDataCell>{item.filename}</CTableDataCell>
              <CTableDataCell>{item.status}</CTableDataCell>
              <CTableDataCell>
                {item.status === "done" && (
                  <CButton
                    color="secondary"
                    variant="outline"
                    onClick={() => {
                      handleSubmitDownload(item.filename);
                    }}
                  >
                    Download
                  </CButton>
                )}
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </main>
  );
}

export default App;

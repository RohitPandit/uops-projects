import "./style.css";
import { useEffect, useState } from "react"
import FooterComponent from "../../../Components/Layouts/Footer";
import SidemenuComponent from "../../../Components/Layouts/Sidemenu";
import AdminNav from "../../../Components/Layouts/AdminNav";
import $ from "jquery";

import toast from 'react-hot-toast';
import { createCourse, getCourses } from "../../../Services/api/course";

function CourcesModule() {

  const [addEdit, setAddEdit] = useState(0);
  const [name, setName] = useState("");
  const [semester, setSemester] = useState(0);
  const [period, setPeriod] = useState(0);
  const [status, setStatus] = useState(1);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    document.title = "UoPS | Admin - Course Module";
    getCourse();
  }, [])

  const array = [
    { name: "BE in Computer Engineering", semister: 8, period: 4, status: "ACTIVE" },
    { name: "BE in Mechanical Engineering", semister: 8, period: 4, status: "ACTIVE" },
    { name: "BE in Civil Engineering", semister: 8, period: 4, status: "ACTIVE" },
    { name: "BE in Electrical Engineering", semister: 8, period: 4, status: "ACTIVE" },
    { name: "B.B.A.", semister: 6, period: 3, status: "ACTIVE" },
    { name: "B.Com", semister: 6, period: 3, status: "ACTIVE" },
    { name: "B.C.A.", semister: 6, period: 3, status: "ACTIVE" },
    { name: "B.S.C", semister: 6, period: 3, status: "ACTIVE" },
    { name: "B.C.S.", semister: 6, period: 3, status: "ACTIVE" },
    { name: "B.A.", semister: 6, period: 3, status: "ACTIVE" },
  ]

  const addCourse = async() => {
    if (!name || !semester || !period) {
      toast.error("All fields must be provided.")
      return;
    }

    setLoader(true);
    const res = await createCourse(name, semester, period);
    if (res.status === 200) {
      toast.success(res.data.message);
      setLoader(false);
      document.getElementById("closeCourseModal").click();
    } else if (res.status === 500) {
      toast.error(res.data.message);
      setLoader(false);
    }
  }

  const getCourse = async() => {
    const res = await getCourses();
    console.log("res, ", res)
    if (res.status === 200) {
      setData(res.data.data);
      dataTableApply();
    } else if (res.status === 500) {
      setData([]);
      dataTableApply();
    }
  }

  const dataTableApply = () => {
    if (!$.fn.DataTable.isDataTable("#courseTableDT")) {
      // $(document).ready(function () {
      setTimeout(function () {
        $("#courseTableDT").dataTable({
          destroy: true,
          pagingType: "full_numbers",
          pageLength: 20,
          processing: true,
          dom: "Bfrtip",
          select: {
            style: "single",
          },

          buttons: [
            {
              extend: "pageLength",
              className: "btn btn-sm btn-secondary bg-secondary",
            },
            {
              extend: "csv",
              className: "btn btn-sm btn-success bg-success",
            },
            {
              extend: "print",
              customize: function (win) {
                $(win.document.body).css("font-size", "10pt");
                $(win.document.body)
                  .find("table")
                  .addClass("compact")
                  .css("font-size", "inherit");
              },
              className: "btn btn-sm btn-danger bg-danger",
            },
          ],

          fnRowCallback: function (
            nRow,
            aData,
            iDisplayIndex,
            iDisplayIndexFull
          ) {
            var index = iDisplayIndexFull + 1;
            $("td:first", nRow).html(index);
            return nRow;
          },

          lengthMenu: [
            [10, 20, 30, 50, -1],
            [10, 20, 30, 50, "All"],
          ],
          columnDefs: [
            {
              targets: 0,
              render: function (data, type, row, meta) {
                return type === "export" ? meta.row + 1 : data;
              },
            },
          ],
        });
      }, 500);
      // });
    }
  }

  const clearFields = async() => {
    setName("");
    setSemester(0);
    setPeriod(0);
  }

  return (
    <>
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">

          <SidemenuComponent />

          <div className="layout-page">

            <AdminNav profileImgPath="../assets/img/avatars/admin.png" role="admin" />
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">

                <h4 className="fw-bold py-3 mb-4 text-start"><span className="text-muted fw-light">Admin /</span> Cources Module</h4>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="card text-start">
                      <h5 className="card-header">
                        Cources List

                        <button
                          type="button"
                          className="btn btn-primary float-end"
                          data-bs-toggle="modal"
                          data-bs-target="#basicModal"
                        >
                          Add Course
                        </button>
                      </h5>
                      <div className="card-content p-2">
                        <div className="table-responsive text-start">
                          <table className="table text-nowrap" id="courseTableDT">
                            <thead>
                              <tr>
                                <th>No</th>
                                <th>Cource Name</th>
                                <th>Semister</th>
                                <th>Period</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody className="table-border-bottom-0">
                              {
                                data.map((ele, index) => {
                                  return (<>
                                    <tr>
                                      <td>{index + 1}</td>
                                      <td>{ele.name}</td>
                                      <td>{ele.semister} SEM</td>
                                      <td>{ele.period} YEAR</td>
                                      <td>
                                        {ele.status === 1 && <span className="badge bg-label-success"> ACTIVE </span>}
                                        {ele.status === 0 && <span className="badge bg-label-danger"> DEACTIVE </span>}
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <span style={{ cursor: "pointer" }}>
                                            <i className="bx bx-pen mx-1"></i>
                                          </span>
                                          <span style={{ cursor: "pointer" }}>
                                            <i className="bx bx-show mx-1"></i>
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  </>)
                                })
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <FooterComponent />

                <div className="content-backdrop fade"></div>
              </div>
            </div>
          </div>


          <div className="modal fade" id="basicModal" tabindex="-1" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel1">Create/Update Cource</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={clearFields}
                  ></button>
                </div>
                <div className="modal-body text-start">
                  <div className="row">
                    <div className="col mb-3">
                      <label htmlFor="courceName" className="form-label">Cource Name</label>
                      <input type="text" id="courceName" className="form-control" placeholder="Cource Name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col mb-3">
                      <label htmlFor="semister" className="form-label">Semister</label>
                      <input type="number" id="semister" className="form-control" placeholder="Semister count how many sem available for this cources" value={semester} onChange={(e) => setSemester(e.target.value)} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col mb-3">
                      <label htmlFor="period" className="form-label">Period</label>
                      <input type="number" id="period" className="form-control" placeholder="Period in years" value={period} onChange={(e) => setPeriod(e.target.value)} />
                    </div>
                  </div>
                  {addEdit === 1 &&
                    <div className="row">
                      <div className="col mb-3">
                        <label htmlFor="status" className="form-label">Status</label>
                        <select className="form-select" id="exampleFormControlSelect1" aria-label="Default select example" value={status} onChange={(e) => setStatus(e.target.value)}>
                          <option selected="" disabled>--SELECT--</option>
                          <option value="1">ACTIVE</option>
                          <option value="0">DEACTIVE</option>
                        </select>
                      </div>
                    </div>
                  }
                </div>
                <div className="modal-footer">
                  <button type="button" id="closeCourseModal" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={clearFields}>
                    Close
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => addCourse()}>
                    {
                      loader === true ? 
                      <div class="spinner-border spinner-border-sm text-dark" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div> :
                      "Save changes"
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="layout-overlay layout-menu-toggle"></div>
        </div>
      </div>
    </>
  );
}

export default CourcesModule;

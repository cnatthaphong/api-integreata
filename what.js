// app.post('/projects', jsonParser, function (req, res, next) {
//     const IntMemberId = req.body.IntMemberId ;
//     console.log(IntMemberId)
//     mssql.connect(config, function (err) {
//         if (err) {
//             console.log(err.message);
//             return;
//         }
//         console.log('connection complete');
//         let request = new mssql.Request();
//         //  'Select * from v_Project_in_Member WHERE IntMemberId=@IntMemberId'
//         let query = 'select * from v_Project_in_Member where IntMemberId=' +IntMemberId ;
//         let dataReturn = {};
//         request.query(query, function (err, result) {
//         if (err) {
//         console.log(err.message);
//         return;
//         }
//         dataReturn.project = result['recordset'];
//         res.json(dataReturn);
//         });
//         // console.log(result['recordset']);

//         // example data
//         //     { "IntMemberId": 3,
//         //     "MemberGuId": "34E4B56C-FEFD-47A0-95BB-5D9882B66326",
//         //     "IntRoleId": 2, "IntCompanyId": 1,
//         //     "IntPositionId": 4,
//         //     "Username": "eknarin.120643@gmail.com",
//         //     "Password": "81dc9bdb52d04dc20036dbd8313ed055",
//         //     "FirstName": "nut",
//         //     "LastName": null,
//         //     "MemberPic": null,
//         //     "Email": null,
//         //     "DtCreateDate": "2022-07-16T00:28:50.120Z",
//         //     "DtLastUpdate": "2022-07-21T21:49:39.077Z",
//         //     "BitEnable": true,
//         //     "RoleName": "Operator",
//         //     "PositionName": "Foreman",
//         //     "CompanyName": "Thailand Bim User Co., Ltd."
//         // }
//     });
// });

// app.get('/material-category', async function (req, res, next) {
//     mssql.connect(config, function (err) {
//         if (err) {
//             console.log(err.message);
//             return;
//         }
//         console.log('connection complete');
//         let request = new mssql.Request();
//         let query = 'select * from Material_Category';
//         request.query(query, function (err, result) {
//             if (err) {
//                 console.log(err.message);
//                 return;
//             }
//             else {

//                 let data = result['recordsets'][0].map((value, index) => {
//                     return { 'IntCatId': value['IntCatId'], 'CategoryName': value['CategoryName'] }

//                 });
//                 res.json(data);
//             }
//         });
//     });
// })

// app.post('/material-chart', jsonParser, function (req, res, next) {
//     const projectId = req.body.projectId;
//     const disciplineId = req.body.disciplineId;
//     mssql.connect(config, function (err) {
//         if (err) {
//             console.log(err.message);
//             return;
//         }
//         console.log('connection complete');
//         let request = new mssql.Request();
//         let query = 'select * from Drawing where IntProjectId=' + projectId + 'and IntDecilpineId=' + disciplineId;
//         let data = [];
//         request.query(query, function (err, result) {
//             if (err) {
//                 console.log(err.message);
//                 return;
//             }
//             else {
//                 // data['table'] = result['recordsets'][0].map((value, index) => {
//                 //     return { 'IntCatId': value['IntCatId'], 'CategoryName': value['CategoryName'] }
//                 // });
//                 data = [
//                     {
//                         "drawingNo": "1234",
//                         "description": "test1",
//                         "revision": "revision",
//                         "status": "status",
//                         "appDate": "Date1234"
//                     },
//                     {
//                         "drawingNo": "1234",
//                         "description": "test1",
//                         "revision": "revision",
//                         "status": "status",
//                         "appDate": "Date1234"
//                     }
//                 ]
//             }
//         });
//         res.json(data);
//     });
// });

// app.post('/material-form', jsonParser, function (req, res, next) {
//     const projectId = req.body.projectId;
//     const disciplineId = req.body.disciplineId;
//     mssql.connect(config, function (err) {
//         if (err) {
//             console.log(err.message);
//             return;
//         }
//         console.log('connection complete');
//         let request = new mssql.Request();
//         let query = 'select * from Drawing where IntProjectId=' + projectId + 'and IntDecilpineId=' + disciplineId;
//         let data = [];
//         request.query(query, function (err, result) {
//             if (err) {
//                 console.log(err.message);
//                 return;
//             }
//             else {
//                 // data['table'] = result['recordsets'][0].map((value, index) => {
//                 //     return { 'IntCatId': value['IntCatId'], 'CategoryName': value['CategoryName'] }
//                 // });
//                 data = [
//                     {
//                         "drawingNo": "1234",
//                         "description": "test1",
//                         "revision": "revision",
//                         "status": "status",
//                         "appDate": "Date1234"
//                     },
//                     {
//                         "drawingNo": "1234",
//                         "description": "test1",
//                         "revision": "revision",
//                         "status": "status",
//                         "appDate": "Date1234"
//                     }
//                 ]
//             }
//         });
//         res.json(data);
//     });
// });

// app.get('/discipline', async function (req, res, next) {
//     mssql.connect(config, function (err) {
//         if (err) {
//             console.log(err.message);
//             return;
//         }
//         console.log('connection complete');
//         let request = new mssql.Request();
//         let query = 'select * from Discipline';
//         request.query(query, function (err, result) {
//             if (err) {
//                 console.log(err.message);
//                 return;
//             }
//             else {
//                 let data = result['recordsets'][0];
//                 // console.log(data);
//                 res.json(data);
//             }
//         });
//     });
// });

// app.get('/location-type', async function (req, res, next) {
//     mssql.connect(config, function (err) {
//         if (err) {
//             console.log(err.message);
//             return;
//         }
//         console.log('connection complete');
//         let request = new mssql.Request();
//         let query = 'select * from Location_Type';
//         request.query(query, function (err, result) {
//             if (err) {
//                 console.log(err.message);
//                 return;
//             }
//             else {
//                 let data = result['recordsets'][0];
//                 console.log(data);
//                 res.json(data);
//             }
//         });
//     });
// });

// app.post('/drawing-report', jsonParser, function (req, res, next) {
//     const projectId = req.body.projectId;
//     const disciplineId = req.body.disciplineId;
//     console.log(req.body);
//     mssql.connect(config, function (err) {
//         if (err) {
//             console.log(err.message);
//             return;
//         }
//         console.log('connection complete');
//         let request = new mssql.Request();
//         let query = 'select  * from V_Drawing where IntProjectId= ' + projectId + 'and IntDisciplineId =' + disciplineId ;
//         let data = {};
//         request.query(query, function (err, result) {
//             if (err) {
//                 console.log(err.message);
//                 return;
//             }
//             else {
//                 data['table'] = result['recordsets'][0].map((value, index) => {
//                     return { 
//                     drawingNo: value['DrawingNo'],
//                     description: value['DrawingDescription'],
//                     fileName: value['FileName'],
//                     approveDate: value['DtApproveDate'],
//                     intFileId: value['IntRootId']+'',
//                     fileRawName: value['FileRawName'],
//                     projectGuId: value['ProjectGuId'],
//                  }
//                 });
//                 // console.log(data);
//                 res.json(data);
//             }

//         });

//     });
// });

// app.post('/drawing-chart', jsonParser, function (req, res, next) {
//     const projectId = req.body.projectId;
//     const disciplineId = req.body.disciplineId;
//     const year = req.body.year;
//     console.log(req.body)
//     mssql.connect(config, function (err) {
//         if (err) {
//             console.log(err.message);
//             return;
//         }
//         console.log('connection complete');
//         let request = new mssql.Request();
//         let query = 'select  * from V_Drawing_Report where IntProjectId= ' + projectId + 'and IntDisciplineId =' + disciplineId;
//         let data = {};
    
//         request.query(query, function (err, result) {
//             if (err) {
//                 console.log(err.message);
//                 return;
//             }
//             else {
//                 let year1 = year;
//                 let listYear =[]
//                 if (year1 ==''){
//                     result['recordset'].forEach((value, index) => {
//                         let date = new Date('' + value['DtCreateDate']);
//                         if( year1 !== date.getFullYear().toString()){
//                             listYear.push(date.getFullYear().toString());
//                             year1 = date.getFullYear().toString()
//                         }
//                     });
//                     year1 = listYear[0]
//                 }
//                 console.log(year1)
//                 data['listYear'] = listYear;
//                 data['chartBar'] = []
//                 result['recordset'].forEach((value, index) => {
//                     let date = new Date('' + value['DtCreateDate']);
//                     if (date.getFullYear().toString() === year1){
//                         let month = date.getMonth();
//                         data['chartBar'].push({ label: month, plan: value['DrawingPlan'] , actual: value['DrawingActual'] , DisciplineName: value['DisciplineName'] })
//                     }
//                 });
//                 data['chartLine'] = []
//                 result['recordset'].forEach((value, index) => {
//                     let date = new Date('' + value['DtCreateDate']);
//                     if (date.getFullYear().toString() === year1){
//                         let month = date.getMonth();
//                         data['chartLine'].push({ label: month, plan: value['DrawingPlan'] , actual: value['DrawingActual'] , DisciplineName: value['DisciplineName'] })
//                     }
                   
                    
//                 });
//                 // data = {
//                 //     chartBar: [
//                 //         {
//                 //             label: 'Jun',
//                 //             plan: 1000,
//                 //             actual: 900,
//                 //             DisciplineName: 'Architectural'
//                 //         },
//                 //     ],
//                 //     chartLine: [
//                 //         {
//                 //             label: 'Jun',
//                 //             plan: 1000,
//                 //             actual: 900,
//                 //             DisciplineName: 'Architectural'
//                 //         },
//                 //     ]
//                 // }
//                 console.log(data)
//                 res.json(data);

//             }
//         });
//     });
// });

// app.post('/manpower-chart', jsonParser, function (req, res, next) {
//     const projectId = req.body.projectId;
//     const disciplineId = req.body.disciplineId;
//     mssql.connect(config, function (err) {
//         if (err) {
//             console.log(err.message);
//             return;
//         }
//         console.log('connection complete');
//         let request = new mssql.Request();
//         let query = 'select * from Drawing where IntProjectId=' + projectId + 'and IntDecilpineId=' + disciplineId;
//         let data = [];
//         request.query(query, function (err, result) {
//             if (err) {
//                 console.log(err.message);
//                 return;
//             }
//             else {
//                 // data['table'] = result['recordsets'][0].map((value, index) => {
//                 //     return { 'IntCatId': value['IntCatId'], 'CategoryName': value['CategoryName'] }
//                 // });
//                 data = [
//                     {
//                         "drawingNo": "1234",
//                         "description": "test1",
//                         "revision": "revision",
//                         "status": "status",
//                         "appDate": "Date1234"
//                     },
//                     {
//                         "drawingNo": "1234",
//                         "description": "test1",
//                         "revision": "revision",
//                         "status": "status",
//                         "appDate": "Date1234"
//                     }
//                 ]
//             }
//         });
//         res.json(data);
//     });
// });

// app.post('/manpower-form', jsonParser, function (req, res, next) {
//     const projectId = req.body.projectId;
//     const disciplineId = req.body.disciplineId;
//     mssql.connect(config, function (err) {
//         if (err) {
//             console.log(err.message);
//             return;
//         }
//         console.log('connection complete');
//         let request = new mssql.Request();
//         let query = 'select * from Drawing where IntProjectId=' + projectId + 'and IntDecilpineId=' + disciplineId;
//         let data = [];
//         request.query(query, function (err, result) {
//             if (err) {
//                 console.log(err.message);
//                 return;
//             }
//             else {
//                 // data['table'] = result['recordsets'][0].map((value, index) => {
//                 //     return { 'IntCatId': value['IntCatId'], 'CategoryName': value['CategoryName'] }
//                 // });
//                 data = [
//                     {
//                         "drawingNo": "1234",
//                         "description": "test1",
//                         "revision": "revision",
//                         "status": "status",
//                         "appDate": "Date1234"
//                     },
//                     {
//                         "drawingNo": "1234",
//                         "description": "test1",
//                         "revision": "revision",
//                         "status": "status",
//                         "appDate": "Date1234"
//                     }
//                 ]
//             }
//         });
//         res.json(data);
//     });
// });


// app.post('/daily-report', jsonParser, function (req, res, next) {
//     const IntMemberId = req.body.IntMemberId;
//     mssql.connect(config, function (err) {
//         if (err) {
//             console.log(err.message);
//             return;
//         }
//         console.log('connection complete');
//         let request = new mssql.Request();
//         let query = 'select * from v_Daily_Report where IntMemberId=' + IntMemberId;
//         let data = {};
//         request.query(query, function (err, result) {
//             if (err) {
//                 console.log(err.message);
//                 return;
//             }
//             else {
//                 // data['table'] = result['recordsets'][0].map((value, index) => {
//                 //     return { 'IntCatId': value['IntCatId'], 'CategoryName': value['CategoryName'] }
//                 // });
//                 data['reports'] = result['recordsets'][0];
//                 console.log(data)
//                 res.json(data);
//             }
//         });
        
//     });
// });

// app.post('/daily-form', jsonParser ,function (req, res, next) {
//     try{
//         IntDisciplineId = req.body.IntDisciplineId;
//         IntLocationId = req.body.IntLocationId;
//         ReportContent = req.body.ReportContent;
//         IntMemberId = req.body.IntMemberId;
//         mssql.connect(config, function (err) {
//             if (err) {
//                 console.log(err.message);
//                 return;
//             }
//             console.log('connection complete');
//             let request = new mssql.Request();
//             let data = [];
//             const values = [[IntDisciplineId, IntLocationId,IntMemberId,ReportContent]];
//             console.log(values);
//             let query =`INSERT INTO Report_Daily (IntDisciplineId,IntLocationId,IntMemberId,ReportContent) OUTPUT Inserted.IntReportId VALUES (${IntDisciplineId},${IntLocationId},${IntMemberId},'${ReportContent}')`
//             request.query(query, function (err, result) {
//                 let data = {};
//                 if (err) {
//                     console.log(err.message);
//                     res.json(data);
//                     return
//                 }
//                 else {
//                     data = result['recordsets'][0][0]
//                     console.log(data)
//                     res.json(data);
//                 }
//             });
//         });
//     }
//     catch(e){
//         let data = {};
//         res.json(data);
//     }
// });

// app.post('/daily-form-update', jsonParser ,function (req, res, next) {
//     try{
//         IntReportId = req.body.IntReportId
//         IntDisciplineId = req.body.IntDisciplineId;
//         IntLocationId = req.body.IntLocationId;
//         ReportContent = req.body.ReportContent;
//         IntMemberId = req.body.IntMemberId;
//         mssql.connect(config, function (err) {
//             if (err) {
//                 console.log(err.message);
//                 return;
//             }
//             console.log('connection complete');
//             let request = new mssql.Request();
//             let data = [];
//             const values = [[IntDisciplineId, IntLocationId,IntMemberId,ReportContent]];
//             console.log(values);
//             let query =`UPDATE Report_Daily SET  IntDisciplineId =${IntDisciplineId},IntLocationId=${IntLocationId},IntMemberId=${IntMemberId},ReportContent='${ReportContent}' WHERE IntReportId=${IntReportId}`
//             console.log(query)
//             request.query(query, function (err, result) {
//                 let data = {};
//                 if (err) {
//                     console.log(err.message);
//                     res.json(data);
//                     return
//                 }
//                 else {
//                     data = {'IntReportId':IntReportId}
//                     res.json(data);
//                 }
//             });
//         });
//     }
//     catch(e){
//         let data = {'IntReportId':IntReportId};
//         res.json(data);
//     }
// });


// app.post('/daily-form-images', upload.array("files"),function (req, res, next) {
//     try{
//         const ProjectGuId = req.body.ProjectGuId;
//         const files = req.files;
//         const IntReportId = req.body.IntReportId;
//         console.log(ProjectGuId);
//         console.log(IntReportId);
//         console.log(files);
//         let data = {};
//         res.json(data);
//     }
//     catch(e){
//         let data = {};
//         res.json(data);
//     }
// });

// app.post('/location-name', jsonParser, function (req, res, next) {
//     const projectId = req.body.projectId;
//     mssql.connect(config, function (err) {
//         if (err) {
//             console.log(err.message);
//             return;
//         }
//         console.log('connection complete');
//         let request = new mssql.Request();
//         console.log(projectId )
//         let query = 'select IntLocationId,IntLocationTypeId,LocationName from Project_Location where IntProjectId= ' + projectId;
//         let data = {};
//         request.query(query, function (err, result) {
//             if (err) {
//                 console.log(err.message);
//                 return;
//             }
//             else {
//                 data['locations'] = result['recordsets'][0];
//                 console.log(data);
//                 res.json(data);
//             }

//         });

//     });
// });


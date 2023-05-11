const PORT = process.env.PORT || 4000
const fs = require('fs');
const path = require('path');
const express = require('express')
const cors = require('cors')
const mssql = require('mssql')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const md5 = require('md5');
const app = express()
const multer = require('multer');
const axios = require('axios');
const config = {
  user: 'integreatadba',
  password: 'zJws5b4#QgvF374eo5',
  database: 'integreata',
  server: 'thailandbimuser.com',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {

    let des = './uploads/project/' + req.body.ProjectGuId + '/' + req.body.type + '/' + req.body.IntTaskId + "/";
    fs.mkdir(des, { recursive: true }, (err) => {
      console.log(des)
      cb(null, des);
    });
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage });

app.get('', async function (req, res, next) {
  res.redirect("/api")
});

app.get('/api', async function (req, res, next) {

  res.json({
    port: ['/login',
      '/projects'
    ],
    get: ['/material-category',
      '/drawing-discipline']
  });

});

app.post('/login', jsonParser, function (req, res, next) {
  const username = req.body.username || '';
  const password = req.body.password || '';
  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    const hashPassword = md5(password);
    let request = new mssql.Request();
    //  'Select * from v_Project_in_Member WHERE IntMemberId=@IntMemberId'
    let query = 'select * from v_Members where username=\'' + username + '\' and password=\'' + hashPassword + '\'';
    //let 

    let dataReturn = {};
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log(result['recordset']);
      dataReturn.canLogin = result['recordset'].length === 1;
      if (result['recordset'].length === 1) {
        dataReturn.IntMemberId = result['recordset'][0]['IntMemberId'];
      } else {
        dataReturn.error = 'can not Login';
      }
      res.json(dataReturn);
    });
  });
});


app.post('/projects', jsonParser, function (req, res, next) {
  const IntMemberId = req.body.IntMemberId;
  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    let query = 'select IntProjectId,ProjectGuId,ProjectName from v_Project_in_Member where IntMemberId=' + IntMemberId;
    let dataReturn = {};
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      dataReturn.projects = result['recordset'];
      res.json(dataReturn);
    });
  });
});

app.post('/buildings', jsonParser, (req, res) => {
  const IntProjectId = req.body.IntProjectId;
  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const query = `SELECT IntBuildingId, BuildingName FROM Project_Building WHERE IntProjectId=` + IntProjectId;
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log(result['recordset'])
      res.json({ 'buildings': result['recordset'] });
    });
  });
});

app.post('/floors', jsonParser, (req, res) => {
  const IntDisciplineId = req.body.IntDisciplineId;
  const IntBuildingId = req.body.IntBuildingId;
  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const query = 'SELECT IntFloorId, FloorNo FROM Project_Floor WHERE IntDisciplineId=' + IntDisciplineId + ' and IntBuildingId=' + IntBuildingId;
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      res.json({ 'floors': result['recordset'] });
    });
  });
});

app.post('/loops', jsonParser, (req, res) => {
  const IntDisciplineId = req.body.IntDisciplineId;
  const IntBuildingId = req.body.IntBuildingId;
  const IntFloorId = req.body.IntFloorId;

  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const query = "SELECT distinct LoopNo FROM Project_Loop WHERE IntDisciplineId=" + IntDisciplineId + " and IntBuildingId=" + IntBuildingId + "and IntFloorId=" + IntFloorId;
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      res.json({ "loops": result['recordset'] });
      mssql.close();
    });
  });
});

app.post('/rooms', jsonParser, (req, res) => {
  console.log(req.body)
  const IntDisciplineId = req.body.IntDisciplineId;
  const IntFloorId = req.body.IntFloorId;

  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const query = "SELECT IntRoomId, RoomNo FROM Project_Room  WHERE  IntFloorId=" + IntFloorId;
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      res.json({ "rooms": result['recordset'] });
      mssql.close();
    });
  });
});

app.post('/categorys', jsonParser, (req, res) => {
  const IntDisciplineId = req.body.IntDisciplineId;
  const IntBuildingId = req.body.IntBuildingId;
  const IntFloorId = req.body.IntFloorId;

  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const query = "SELECT distinct LoopNo FROM Project_Loop WHERE IntDisciplineId=" + IntDisciplineId + " and IntBuildingId=" + IntBuildingId;
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log(result['recordset'])
      res.json({ "categorys": result['recordset'] });
      mssql.close();
    });
  });
});

app.post('/tasks', jsonParser, (req, res) => {
  const IntDisciplineId = req.body.IntDisciplineId;
  const IntBuildingId = req.body.IntBuildingId;
  const IntFloorId = req.body.IntFloorId;
  const LoopNo = req.body.LoopNo;
  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();

    const query = "SELECT IntLoopId, TaskName FROM Project_Loop WHERE IntDisciplineId=" + IntDisciplineId + " and IntBuildingId=" + IntBuildingId + "and IntFloorId=" + IntFloorId + "and LoopNo=" + LoopNo;
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      const data = { "tasks": result['recordset'] }
      // console.log(data)
      res.json(data);
      mssql.close();
    });
  });
});

app.post('/tasks_no_floorId', jsonParser, (req, res) => {
  const IntDisciplineId = req.body.IntDisciplineId;
  const IntBuildingId = req.body.IntBuildingId;
  const LoopNo = req.body.LoopNo;

  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();

    const query = "SELECT IntLoopId, TaskName FROM Project_Loop WHERE IntDisciplineId=" + IntDisciplineId + " and IntBuildingId=" + IntBuildingId + "and LoopNo=" + LoopNo;
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      const data = { "tasks": result['recordset'] }
      // console.log(data)
      res.json(data);
      mssql.close();
    });
  });
});



app.get('/holds', jsonParser, (req, res) => {
  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();

    const query = "SELECT HoldStatusId, HoldStatusName FROM Project_Hold_Status";
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      const data = { "holds": result['recordset'] }
      // console.log(data)
      res.json(data);
      mssql.close();
    });
  });
});

app.post('/add_content_construc_task', jsonParser, (req, res) => {
  const task = req.body;
  const { IntBuildingId, IntDisciplineId, IntFloorId, IntLoopId, HoldStatusId, TaskStatusId, TaskDescription, TaskCompleted, FileNames, } = task;
  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const insertTaskQuery = ` INSERT INTO Project_Task(IntBuildingId,IntDisciplineId , IntFloorId,  IntLoopId, HoldStatusId, TaskStatusId,TaskCompleted, TaskDescription)
      OUTPUT Inserted.IntTaskId
      VALUES(${IntBuildingId},${IntDisciplineId}, ${IntFloorId}, ${IntLoopId}, ${HoldStatusId}, ${TaskStatusId},${TaskCompleted} ,'${TaskDescription}')`;
    request.query(insertTaskQuery, function (err, result) {
      if (err) {
        console.log(err.message);
        res.send({ 'error': err.message });
        return;
      }

      const IntTaskId = result['recordset'][0]['IntTaskId'];

      if (FileNames.length == 0) {
        res.send({ "IntTaskId": IntTaskId });
      }
      FileNames.forEach((FileName, index) => {
        const insertFileQuery = `INSERT INTO Project_Task_File(IntTaskId, FileName) VALUES (${IntTaskId}, '${FileName}') `;
        request.query(insertFileQuery, function (err, result) {
          if (err) {
            console.log(err.message);
            return;
          }

          if (index === FileNames.length - 1) {
            upload.array('files')
            FinishTaskAPI(IntTaskId)
            res.send({ "IntTaskId": IntTaskId });
            mssql.close();
          }
        });
      });
    });
  });
});


app.post('/add_images_construc_task', [jsonParser, upload.array('files')], function (req, res, next) {
  try {
    const ProjectGuId = req.query.ProjectGuId;
    const files = req.files;
    const IntTaskId = req.query.IntTaskId;
    // console.log(ProjectGuId);
    // console.log(IntTaskId);
    // console.log(files);
    res.json({ "result": 'file uploaded' });
  }
  catch (e) {
    let data = {};
    res.json({ "error": 'message Error' });
  }
});


app.post('/add_content_struc_task', jsonParser, (req, res) => {
  const task = req.body;
  const { IntBuildingId, IntDisciplineId, IntFloorId, IntLoopId, HoldStatusId, TaskStatusId, TaskDescription, TaskCompleted, FileNames, } = task;
  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const insertTaskQuery = ` INSERT INTO Project_Task(IntBuildingId,IntDisciplineId , IntFloorId,  IntLoopId, HoldStatusId, TaskStatusId,TaskCompleted, TaskDescription)
      OUTPUT Inserted.IntTaskId
      VALUES(${IntBuildingId},${IntDisciplineId}, ${IntFloorId}, ${IntLoopId}, ${HoldStatusId}, ${TaskStatusId},${TaskCompleted} ,'${TaskDescription}')`;
    request.query(insertTaskQuery, function (err, result) {
      if (err) {
        console.log(err.message);
        res.send({ 'error': err.message });
        return;
      }

      const IntTaskId = result['recordset'][0]['IntTaskId'];
      if (FileNames.length == 0) {
        res.send({ "IntTaskId": IntTaskId });
      }
      FileNames.forEach((FileName, index) => {
        const insertFileQuery = `INSERT INTO Project_Task_File(IntTaskId, FileName) VALUES (${IntTaskId}, '${FileName}') `;
        request.query(insertFileQuery, function (err, result) {
          if (err) {
            console.log(err.message);
            return;
          }

          if (index === FileNames.length - 1) {
            upload.array('files')
            FinishTaskAPI(IntTaskId)
            res.send({ "IntTaskId": IntTaskId });
            mssql.close();
          }
        });
      });
    });
  });
});

app.post('/add_images_struc_task', [jsonParser, upload.array('files')], function (req, res, next) {
  try {
    const ProjectGuId = req.query.ProjectGuId;
    const files = req.files;
    const IntTaskId = req.query.IntTaskId;
    // console.log(ProjectGuId);
    // console.log(IntTaskId);
    // console.log(files);
    res.json({ "result": 'file uploaded' });
  }
  catch (e) {
    let data = {};
    res.json({ "error": 'message Error' });
  }
});

app.post('/add_content_external_task', jsonParser, (req, res) => {
  const task = req.body;
  const { IntBuildingId, IntDisciplineId, IntLoopId, HoldStatusId, TaskStatusId, TaskDescription, TaskCompleted, FileNames, } = task;
  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const insertTaskQuery = ` INSERT INTO Project_Task(IntBuildingId,IntDisciplineId , IntFloorId,  IntLoopId, HoldStatusId, TaskStatusId,TaskCompleted, TaskDescription)
      OUTPUT Inserted.IntTaskId
      VALUES(${IntBuildingId},${IntDisciplineId},0 , ${IntLoopId}, ${HoldStatusId}, ${TaskStatusId},${TaskCompleted} ,'${TaskDescription}')`;
    request.query(insertTaskQuery, function (err, result) {
      if (err) {
        console.log(err.message);
        res.send({ 'error': err.message });
        return;
      }

      const IntTaskId = result['recordset'][0]['IntTaskId'];

      if (FileNames.length == 0) {
        res.send({ "IntTaskId": IntTaskId });
      }
      FileNames.forEach((FileName, index) => {
        const insertFileQuery = `INSERT INTO Project_Task_File(IntTaskId, FileName) VALUES (${IntTaskId}, '${FileName}') `;
        request.query(insertFileQuery, function (err, result) {
          if (err) {
            console.log(err.message);
            return;
          }

          if (index === FileNames.length - 1) {
            upload.array('files')
            FinishTaskAPI(IntTaskId)
            res.send({ "IntTaskId": IntTaskId });
            mssql.close();
          }
        });
      });
    });
  });
});


app.post('/add_images_external_task', [jsonParser, upload.array('files')], function (req, res, next) {
  try {
    const ProjectGuId = req.query.ProjectGuId;
    const files = req.files;
    const IntTaskId = req.query.IntTaskId;
    // console.log(ProjectGuId);
    // console.log(IntTaskId);
    // console.log(files);
    res.json({ "result": 'file uploaded' });
  }
  catch (e) {
    let data = {};
    res.json({ "error": 'message Error' });
  }
});

app.post('/add_content_exterior_task', jsonParser, (req, res) => {
  const task = req.body;
  const { IntBuildingId, IntDisciplineId, IntLoopId, HoldStatusId, TaskStatusId, TaskDescription, TaskCompleted, FileNames, } = task;
  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const insertTaskQuery = ` INSERT INTO Project_Task(IntBuildingId,IntDisciplineId , IntFloorId,  IntLoopId, HoldStatusId, TaskStatusId,TaskCompleted, TaskDescription)
      OUTPUT Inserted.IntTaskId
      VALUES(${IntBuildingId},${IntDisciplineId},0 , ${IntLoopId}, ${HoldStatusId}, ${TaskStatusId},${TaskCompleted} ,'${TaskDescription}')`;
    request.query(insertTaskQuery, function (err, result) {
      if (err) {
        console.log(err.message);
        res.send({ 'error': err.message });
        return;
      }

      const IntTaskId = result['recordset'][0]['IntTaskId'];

      if (FileNames.length == 0) {
        res.send({ "IntTaskId": IntTaskId });
      }
      FileNames.forEach((FileName, index) => {
        const insertFileQuery = `INSERT INTO Project_Task_File(IntTaskId, FileName) VALUES (${IntTaskId}, '${FileName}') `;
        request.query(insertFileQuery, function (err, result) {
          if (err) {
            console.log(err.message);
            return;
          }

          if (index === FileNames.length - 1) {
            upload.array('files')
            FinishTaskAPI(IntTaskId)
            res.send({ "IntTaskId": IntTaskId });
            mssql.close();
          }
        });
      });
    });
  });
});


app.post('/add_images_exterior_task', [jsonParser, upload.array('files')], function (req, res, next) {
  try {
    const ProjectGuId = req.query.ProjectGuId;
    const files = req.files;
    const IntTaskId = req.query.IntTaskId;
    // console.log(ProjectGuId);
    // console.log(IntTaskId);
    // console.log(files);
    res.json({ "result": 'file uploaded' });
  }
  catch (e) {
    let data = {};
    res.json({ "error": 'message Error' });
  }
});

app.post('/add_content_deflect_task', jsonParser, (req, res) => {
  const task = req.body;
  const { IntRoomId, HoldStatusId, DeflectStatusId, DeflectDescription, FileNames } = task;
  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const insertTaskQuery = ` INSERT INTO Project_Deflect(IntRoomId, HoldStatusId, DeflectStatusId, DeflectDescription)
      OUTPUT Inserted.IntDeflectId
      VALUES(${IntRoomId},${HoldStatusId}, ${DeflectStatusId}, '${DeflectDescription}')`;
    request.query(insertTaskQuery, function (err, result) {
      if (err) {
        console.log(err.message);
        res.send({ 'error': err.message });
        return;
      }

      const IntDeflectId = result['recordset'][0]['IntDeflectId'];

      if (FileNames.length == 0) {
        console.log(IntDeflectId)
        res.send({ "IntTaskId": IntDeflectId });
      }
      FileNames.forEach((FileName, index) => {
        const insertFileQuery = `INSERT INTO Project_Deflect_File(IntDeflectId, FileName) VALUES (${IntDeflectId}, '${FileName}') `;
        request.query(insertFileQuery, function (err, result) {
          if (err) {
            console.log(err.message);
            return;
          }

          if (index === FileNames.length - 1) {
            upload.array('files')
            // FinishTaskAPI(IntDeflectId)
            console.log(IntDeflectId)
            res.send({ "IntTaskId": IntDeflectId });
            mssql.close();
          }
        });
      });
    });
  });
});

app.post('/add_images_deflect_task', [jsonParser, upload.array('files')], function (req, res, next) {
  try {
    const ProjectGuId = req.query.ProjectGuId;
    const files = req.files;
    const IntTaskId = req.query.IntTaskId;
    // console.log(ProjectGuId);
    // console.log(IntTaskId);
    // console.log(files);
    res.json({ "result": 'file uploaded' });
  }
  catch (e) {
    let data = {};
    res.json({ "error": 'message Error' });
  }
});

app.post('/get_construc_task', jsonParser, (req, res) => {
  const Date = req.body.DateTime;
  const IntDisciplineId = req.body.IntDisciplineId;
  const IntBuildingId = req.body.IntBuildingId;
  const IntFloorId = req.body.IntFloorId;
  const IntLoopId = req.body.IntLoopId;
  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const query = "SELECT * FROM v_Project_Task WHERE IntDisciplineId=" + IntDisciplineId + " and IntBuildingId=" + IntBuildingId + "and IntFloorId=" + IntFloorId + "and IntLoopId=" + IntLoopId + " and DATEDIFF(day,DtCreateDate,'" + Date + "') = 0";
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        res.json({});
        return;

      }
      let data = { "status": "not-have" }
      if (result['recordset'].length > 0) {
        data = result['recordset'][0];
        data['status'] = "have"
        // console.log(data)
        const query = "SELECT FileName FROM Project_Task_File WHERE IntTaskId=" + data['IntTaskId'] ;
        // console.log(query)
        request.query(query, function (err, result) {
          if (err) {
            console.log(err.message);
            res.json({});
            return;

          }
          data['filename'] = []
          if (result['recordset'].length > 0) {
            data['filename'] = result['recordset'];
            data['status'] = "have"
          }
          console.log(data)
          res.json(data);
          mssql.close();

        });


       
      }
      else{
        res.json(data);
        mssql.close();
      }
      
    });
  });
});

app.post('/get_struc_task', jsonParser, (req, res) => {
  const Date = req.body.DateTime;
  const IntDisciplineId = req.body.IntDisciplineId;
  const IntBuildingId = req.body.IntBuildingId;
  const IntFloorId = req.body.IntFloorId;
  const IntLoopId = req.body.IntLoopId;
  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const query = "SELECT * FROM v_Project_Task WHERE IntDisciplineId=" + IntDisciplineId + " and IntBuildingId=" + IntBuildingId + "and IntFloorId=" + IntFloorId + "and IntLoopId=" + IntLoopId + " and DATEDIFF(day,DtCreateDate,'" + Date + "') = 0";
    // console.log(query)
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        res.json({});
        return;

      }
      let data = { "status": "not-have" }
      if (result['recordset'].length > 0) {
        data = result['recordset'][0];
        data['status'] = "have"
        // console.log(data)
        const query = "SELECT FileName FROM Project_Task_File WHERE IntTaskId=" + data['IntTaskId'] ;
        // console.log(query)
        request.query(query, function (err, result) {
          if (err) {
            console.log(err.message);
            res.json({});
            return;

          }
          data['filename'] = []
          if (result['recordset'].length > 0) {
            data['filename'] = result['recordset'];
            data['status'] = "have"
          }
          // console.log(data)
          res.json(data);
          mssql.close();

        });
      }
      else{
        res.json(data);
        mssql.close();
      }
      
    });
  });
});

app.post('/get_external_task', jsonParser, (req, res) => {
  const Date = req.body.DateTime;
  const IntDisciplineId = req.body.IntDisciplineId;
  const IntBuildingId = req.body.IntBuildingId;
  const IntFloorId = 0;
  const IntLoopId = req.body.IntLoopId;
  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const query = "SELECT * FROM v_Project_Task WHERE IntDisciplineId=" + IntDisciplineId + " and IntBuildingId=" + IntBuildingId + "and IntFloorId=" + IntFloorId + "and IntLoopId=" + IntLoopId + " and DATEDIFF(day,DtCreateDate,'" + Date + "') = 0";
    // console.log(query)
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        res.json({});
        return;

      }
      let data = { "status": "not-have" }
      if (result['recordset'].length > 0) {
        data = result['recordset'][0];
        data['status'] = "have"
        // console.log(data)
        const query = "SELECT FileName FROM Project_Task_File WHERE IntTaskId=" + data['IntTaskId'] ;
        // console.log(query)
        request.query(query, function (err, result) {
          if (err) {
            console.log(err.message);
            res.json({});
            return;

          }
          data['filename'] = []
          if (result['recordset'].length > 0) {
            data['filename'] = result['recordset'];
            data['status'] = "have"
          }
          // console.log(data)
          res.json(data);
          mssql.close();

        });


       
      }
      else{
        res.json(data);
        mssql.close();
      }
      
    });
  });
});

app.post('/get_exterior_task', jsonParser, (req, res) => {
  const Date = req.body.DateTime;
  const IntDisciplineId = req.body.IntDisciplineId;
  const IntBuildingId = req.body.IntBuildingId;
  const IntFloorId = 0;
  const IntLoopId = req.body.IntLoopId;
  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const query = "SELECT * FROM v_Project_Task WHERE IntDisciplineId=" + IntDisciplineId + " and IntBuildingId=" + IntBuildingId + "and IntFloorId=" + IntFloorId + "and IntLoopId=" + IntLoopId + " and DATEDIFF(day,DtCreateDate,'" + Date + "') = 0";
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        res.json({});
        return;

      }
      let data = { "status": "not-have" }
      if (result['recordset'].length > 0) {
        data = result['recordset'][0];
        data['status'] = "have"
        // console.log(data)
        const query = "SELECT FileName FROM Project_Task_File WHERE IntTaskId=" + data['IntTaskId'] ;
        // console.log(query)
        request.query(query, function (err, result) {
          if (err) {
            console.log(err.message);
            res.json({});
            return;

          }
          data['filename'] = []
          if (result['recordset'].length > 0) {
            data['filename'] = result['recordset'];
            data['status'] = "have"
          }
          // console.log(data)
          res.json(data);
          mssql.close();

        });


       
      }
      else{
        res.json(data);
        mssql.close();
      }
      
    });
  });
});


app.post('/get_deflect_task', jsonParser, (req, res) => {
  const Date = req.body.DateTime;
  const IntRoomId = req.body.IntRoomId;

  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const query = "SELECT * FROM v_Project_Deflect WHERE IntRoomId=" + IntRoomId + " and DATEDIFF(day,DtCreateDate,'" + Date + "') = 0";
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        res.json({});
        return;

      }
      let data = { "status": "not-have" }
      if (result['recordset'].length > 0) {
        data = result['recordset'][0];
        data['status'] = "have"
        const query = "SELECT FileName FROM Project_Deflect_File WHERE IntDeflectId=" + data['IntDeflectId'] ;
        // console.log(query)
        request.query(query, function (err, result) {
          if (err) {
            console.log(err.message);
            res.json({});
            return;

          }
          data['filename'] = []
          if (result['recordset'].length > 0) {
            data['filename'] = result['recordset'];
            data['status'] = "have"
          }
          // console.log(data)
          res.json(data);
          mssql.close();

        });


       
      }
      else{
        res.json(data);
        mssql.close();
      }
      
    });
  });
});

app.post('/update_construc_task', jsonParser, (req, res) => {
  const Date = req.body.DateTime;
  const IntDisciplineId = req.body.IntDisciplineId;
  const IntBuildingId = req.body.IntBuildingId;
  const IntFloorId = req.body.IntFloorId;
  const IntLoopId = req.body.IntLoopId;
  const HoldStatusId = req.body.HoldStatusId;
  const TaskStatusId = req.body.TaskStatusId
  const TaskDescription = req.body.TaskDescription;
  const TaskCompleted = req.body.TaskCompleted;

  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const query = "UPDATE Project_Task SET HoldStatusId =" + HoldStatusId + ",TaskStatusId = " + TaskStatusId + ",TaskDescription='" + TaskDescription + "',TaskCompleted =" + TaskCompleted + "OUTPUT Inserted.IntTaskId WHERE IntDisciplineId=" + IntDisciplineId + " and IntBuildingId=" + IntBuildingId + "and IntFloorId=" + IntFloorId + "and IntLoopId=" + IntLoopId + " and DATEDIFF(day,DtCreateDate,'" + Date + "') = 0";
    // console.log(query)
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      if (result['recordset'] && result['recordset'][0] && result['recordset'][0]['IntTaskId']) {
        const IntTaskId = result['recordset'][0]['IntTaskId'];
        // console.log(IntTaskId);
        FinishTaskAPI(IntTaskId)
        res.send({ "IntTaskId": IntTaskId });
      }
      else {
        res.send({ "error": 'not mat' });
      }


      mssql.close();

    });
  });
});

app.post('/update_struc_task', jsonParser, (req, res) => {
  const Date = req.body.DateTime;
  const IntDisciplineId = req.body.IntDisciplineId;
  const IntBuildingId = req.body.IntBuildingId;
  const IntFloorId = req.body.IntFloorId;
  const IntLoopId = req.body.IntLoopId;
  const HoldStatusId = req.body.HoldStatusId;
  const TaskStatusId = req.body.TaskStatusId
  const TaskDescription = req.body.TaskDescription;
  const TaskCompleted = req.body.TaskCompleted;

  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const query = "UPDATE Project_Task SET HoldStatusId =" + HoldStatusId + ",TaskStatusId = " + TaskStatusId + ",TaskDescription='" + TaskDescription + "',TaskCompleted =" + TaskCompleted + "OUTPUT Inserted.IntTaskId WHERE IntDisciplineId=" + IntDisciplineId + " and IntBuildingId=" + IntBuildingId + "and IntFloorId=" + IntFloorId + "and IntLoopId=" + IntLoopId + " and DATEDIFF(day,DtCreateDate,'" + Date + "') = 0";
    // console.log(query)
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      if (result['recordset'] && result['recordset'][0] && result['recordset'][0]['IntTaskId']) {
        const IntTaskId = result['recordset'][0]['IntTaskId'];
        // console.log(IntTaskId);
        FinishTaskAPI(IntTaskId)
        res.send({ "IntTaskId": IntTaskId });
      }
      else {
        res.send({ "error": 'not mat' });
      }
      mssql.close();

    });
  });
});

app.post('/update_external_task', jsonParser, (req, res) => {
  const Date = req.body.DateTime;
  const IntDisciplineId = req.body.IntDisciplineId;
  const IntBuildingId = req.body.IntBuildingId;
  const IntFloorId = 0;
  const IntLoopId = req.body.IntLoopId;
  const HoldStatusId = req.body.HoldStatusId;
  const TaskStatusId = req.body.TaskStatusId
  const TaskDescription = req.body.TaskDescription;
  const TaskCompleted = req.body.TaskCompleted;

  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const query = "UPDATE Project_Task SET HoldStatusId =" + HoldStatusId + ",TaskStatusId = " + TaskStatusId + ",TaskDescription='" + TaskDescription + "',TaskCompleted =" + TaskCompleted + "OUTPUT Inserted.IntTaskId WHERE IntDisciplineId=" + IntDisciplineId + " and IntBuildingId=" + IntBuildingId + "and IntFloorId=" + IntFloorId + "and IntLoopId=" + IntLoopId + " and DATEDIFF(day,DtCreateDate,'" + Date + "') = 0";
    // console.log(query)
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      if (result['recordset'] && result['recordset'][0] && result['recordset'][0]['IntTaskId']) {
        const IntTaskId = result['recordset'][0]['IntTaskId'];
        // console.log(IntTaskId);
        FinishTaskAPI(IntTaskId)
        res.send({ "IntTaskId": IntTaskId });
      }
      else {
        res.send({ "error": 'not mat' });
      }
      mssql.close();

    });
  });
});

app.post('/update_exterior_task', jsonParser, (req, res) => {
  const Date = req.body.DateTime;
  const IntDisciplineId = req.body.IntDisciplineId;
  const IntBuildingId = req.body.IntBuildingId;
  const IntFloorId = 0;
  const IntLoopId = req.body.IntLoopId;
  const HoldStatusId = req.body.HoldStatusId;
  const TaskStatusId = req.body.TaskStatusId
  const TaskDescription = req.body.TaskDescription;
  const TaskCompleted = req.body.TaskCompleted;

  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const query = "UPDATE Project_Task SET HoldStatusId =" + HoldStatusId + ",TaskStatusId = " + TaskStatusId + ",TaskDescription='" + TaskDescription + "',TaskCompleted =" + TaskCompleted + "OUTPUT Inserted.IntTaskId WHERE IntDisciplineId=" + IntDisciplineId + " and IntBuildingId=" + IntBuildingId + "and IntFloorId=" + IntFloorId + "and IntLoopId=" + IntLoopId + " and DATEDIFF(day,DtCreateDate,'" + Date + "') = 0";
    console.log(query)
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      if (result['recordset'] && result['recordset'][0] && result['recordset'][0]['IntTaskId']) {
        const IntTaskId = result['recordset'][0]['IntTaskId'];
        // console.log(IntTaskId);
        FinishTaskAPI(IntTaskId)
        res.send({ "IntTaskId": IntTaskId });
      }
      else {
        res.send({ "error": 'not mat' });
      }
      mssql.close();

    });
  });
});


app.post('/update_deflect_task', jsonParser, (req, res) => {

  const task = req.body;
  console.log(task);
  const { IntRoomId, HoldStatusId, DeflectStatusId, DeflectDescription, DateTime } = task;

  mssql.connect(config, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('connection complete');
    let request = new mssql.Request();
    const query = "UPDATE Project_Deflect SET HoldStatusId =" + HoldStatusId + ",DeflectStatusId = " + DeflectStatusId + ", DeflectDescription ='" + DeflectDescription + "' OUTPUT Inserted.IntDeflectId WHERE IntRoomId=" + IntRoomId + " and DATEDIFF(day,DtCreateDate,'" + DateTime + "') = 0";
    console.log(query)
    request.query(query, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      if (result['recordset'] && result['recordset'][0] && result['recordset'][0]['IntDeflectId']) {
        const IntDeflectId = result['recordset'][0]['IntDeflectId'];
        // console.log(IntTaskId);
        FinishDeflectAPI(IntDeflectId)
        res.send({ "IntTaskId": IntDeflectId });
      }
      else {
        res.send({ "error": 'not mat' });
      }
      mssql.close();

    });
  });
});



const FinishTaskAPI = async (id) => {
  var data = JSON.stringify({
    "id": id
  });

  var config = {
    method: 'post',
    url: 'https://integreata.com/WebValidation.asmx/FinishTask',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };
  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });

}

const FinishDeflectAPI = async (id) => {
  var data = JSON.stringify({
    "id": id
  });

  var config = {
    method: 'post',
    url: 'https://integreata.com/WebValidation.asmx/FinishDeflect',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };
  console.log('test')
  axios(config)
    .then(function (response) {
      console.log('test')
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });

}




app.listen(PORT, function () {
  var os = require('os');
  var networkInterfaces = os.networkInterfaces();
  // console.log("http://" + networkInterfaces['Wi-Fi'][3]['address'] + ':' + PORT)
  // console.log('CORS-enabled web server listening on port' + PORT)
})
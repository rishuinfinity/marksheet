
//document.write(ff);
//document.write(gg);

    
// function csvToArray (csv) {
//     rows = csv.split("\n");

//     return rows.map(function (row) {
//     	return row.split(",");
//     });
// };
    
//     function processData(allText) {
//     var allTextLines = allText.split(/\r\n|\n/);
//     var headers = allTextLines[0].split(',');
//     var lines = [];

//     for (var i=1; i<allTextLines.length; i++) {
//         var data = allTextLines[i].split(',');
//         if (data.length == headers.length) {

//             var tarr = [];
//             for (var j=0; j<headers.length; j++) {
//                 tarr.push(headers[j]+":"+data[j]);
//             }
//             lines.push(tarr);
//         }
//     }
//      //log(lines);
//      return lines;
// }
function csvJSON(csv){
// this converts csv file to json file
  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].split(",");

	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  }

	  result.push(obj);

  }
  
  return result; //JavaScript object
  //return JSON.stringify(result); //JSON
};


function get_data(){
// this returns the data received in the form of javascript object
  var csv_file;
  var url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDrSrHISpfjthbDhed0Yd42LSAG2wApNIzxdTIolFDDEWmZG6Dau-cLe3Nv0mh6VyXqS8f_qYlUw3a/pub?output=csv";
  // fetch(url).then(a => a.text() ).then(t=>csv_file = t);
  csv_file = gfile(url);
  console.log(csv_file);
  var object_file = csvJSON(csv_file);
  var json_file = JSON.stringify(object_file);
  return object_file;
};
function gfile(url){
    $.ajax({
        async:false,
        url: url,
        dataType: 'text',
        type: 'GET',
        crossDomain : true,
        success: function(data, textStatus, jqXHR){
            console.log(data);
            return data;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log("error occured");
            return null;
        }
    });
    
};
// code for the leaderboard
function get_date_array()
{
// this returns the array of dates required for leaderboard
  var dater = new Date();
  var Dates = [];
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (var i = 0 ; i <7 ; i++)
  {
    dater.setDate(dater.getDate()-1);
    var date_obj = {};
    date_obj['day'] = days[dater.getDay()] ;
    date_obj['date'] = dater.getDate() + months[dater.getMonth()];
    date_obj['id'] = dater.getMonth + "/" + dater.getDate;
    Dates.push(date_obj);
  }
  return Dates;
};

function get_learboard_data()
{
  var dates = get_date_array();
  var data = get_data();
  var storage = [];
  for(var i = 0 ; i < 7 ; i++)
  {
    var values = {};
    for (var data_block in data)
    {
      console.log(data_block["Date of Examination"]);
      if(data_block['Date of Examination'] == dates[i].id)
      {
        values[title] = data_block['Examination Subject'];
        values[fmarks] = data_block['Full Marks of the test'];
        if (values[topmarks] < data_block['Marks obtained']) 
        {
          values[topmarks] = data_block['Marks obtained'];
          values[topper] = data_block['Your Name'];
          values[tmarks] = data_block['Marks obtained'] + "(" + data_block['Negatives'] + ")";
        }
      }
      storage.push(values);
    }
  }
  return storage;
};

function update_leaderboard(box_id){
// this updates the leaderboard at once
  var box = document.getElementById(box_id);
  var dates = get_date_array();
  var storage = get_learboard_data();
  for( var i = 0 ; i < 7 ; i++)
  {
    var today = dates[i];
    var todata = storage[i];
    box.innerHTML +=  fill_leaderboard(today.day,today.date,todata.title,todata.fmarks,todata.topper,todata.tmarks);
  }  
  console.log(get_data());
};

function fill_leaderboard(day,date,title,fmarks,topper,tmarks)
{
  // this returns the html code to fill inside leaderboard
  var row_data = '<div class="row"><!-- main box --><div class="col-10 offset-1 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 weekd"><div class="row r1 "><div id="d1" class="col-sm-8 col-8 day">'+
            day+
          '</div><div id="dt1" class="col-sm-4 col-4 date">'+
            date+
          '</div></div>'+
        '<div class="row r2 "><div id="t1" class="col-sm-9 col-9 topicname">'+
            title+
          '</div><div class="col-sm-3 col-3 fm"><div id="f1" class="fmi">'+
            fmarks+
            '</div></div></div>'+
        '<div class="row r3"><div id="n1" class="col-md-6 col-9 name">'+
            topper+
           '</div><div id="m1" class="col-md-6 col-3 marks">'+
            tmarks+
           '</div></div></div></div>';
  return row_data;
};
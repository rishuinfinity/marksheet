
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
  // console.log(csv_file);
  var object_file = csvJSON(csv_file);
  var json_file = JSON.stringify(object_file);
  return object_file;
};
function gfile(url){
  var csv_data;
    $.ajax({
        async:false,
        url: url,
        dataType: 'text',
        type: 'GET',
        crossDomain : true,
        success: function(data, textStatus, jqXHR){
            // console.log(data);
            csv_data = data;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log("error occured");
            csv_data = "not,found";
        }
    });
    return csv_data;
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
    date_obj['id'] = dater.getMonth()+1 + "/" + dater.getDate();
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
    values['topmarks'] = 0;
    for (var index in data)
    {
      data_block = data[index]
      if(data_block['Date of Examination'] == dates[i].id)
      {
        values['title'] = data_block['Exam Topic'];
        values['fmarks'] = data_block['Full Marks of the test'];
        if (values['topmarks'] < data_block['Marks obtained']) 
        {
          values['topmarks'] = data_block['Marks obtained'];
          values['topper'] = data_block['Your Name'];
          values['tmarks'] = data_block['Marks obtained'] + "(" + data_block['Negatives'] + ")";
        }
      }
    }
    storage.push(values);
  }
  return storage;
};

function update_leaderboard(box_id){
// this updates the leaderboard at once
console.log(box_id);
  var box = document.getElementById(box_id);
  var dates = get_date_array();
  var storage = get_learboard_data();
  console.log(storage);
  for( var i = 0 ; i < 7 ; i++)
  {
    var today = dates[i];
    var todata = storage[i];
    box.innerHTML +=  fill_leaderboard(today.id,today.day,today.date,todata.title,todata.fmarks,todata.topper,todata.tmarks);
  }  
};

function fill_leaderboard(link,day,date,title,fmarks,topper,tmarks)
{
  // this returns the html code to fill inside leaderboard
  var row_data = '<a href = "./marksheet.html?date='+link+'" ><div class="row"><!-- main box --><div class="col-10 offset-1 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 weekd"><div class="row r1 "><div id="d1" class="col-sm-8 col-8 day">'+
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
           '</div></div></div></div></a>';
  return row_data;
};



// code for marksheet
function get_marksheet_data(date_id)
{
  var dates = get_date_array();
  var data = get_data();
  var storage = [];
  var title;
  var fmarks;
  for (var index in data)
  {
    var values = {};
    data_block = data[index]
    if(data_block['Date of Examination'] == date_id)
    {
      title = data_block['Exam Subject'];
      fmarks = data_block['Full Marks of the test'];
      values['marks'] = data_block['Marks obtained'];
      values['name'] = data_block['Your Name'];
      values['omarks'] = data_block['Marks obtained'] + "(" + data_block['Negatives'] + ")";
      storage.push(values);
    }
  }
  var vals = [];
  vals.push(title);
  vals.push(fmarks);
  vals.push(storage);
  return vals;
};

function marks_comparator(kid1,kid2)
{
    
        if(kid1.marks < kid2.marks)
  {
    return 1;
  }
  if(kid1.marks > kid2.marks)
  {
    return -1;
  }
  if(kid1.omarks < kid2.omarks)
  {
    return -1;
  }
  if(kid1.omarks > kid2.omarks)
  {
    return 1;
  }
  return 0;  
    

}

function update_marksheet(date_id,data_list)
{
  var values = get_marksheet_data(date_id);
  var title = values[0];
  var fmarks = values[1];
  var storage = values[2];
  storage.sort(function(x, y) {
  if(x.marks < y.marks)
  {
    return 1;
  }
  if(x.marks > y.marks)
  {
    return -1;
  }
  if(x.omarks < y.omarks)
  {
    return -1;
  }
  if(x.omarks > y.omarks)
  {
    return 1;
  }
  return 0;  
});
  document.getElementById('title').innerHTML = title;
  document.getElementById('fmarks').innerHTML = "FM : "+ fmarks;
  document.getElementById('date').innerHTML = date_id;

  for (var index in storage)
  {
    data_block = storage[index];
    document.getElementById(data_list).innerHTML+= fill_marksheet(data_block.name , data_block.omarks);
  }
}

function fill_marksheet(name,omarks)
{
  var code = '<div class="row data1"><div class="col-8 col-sm-8 name1">'+
             name+
           '</div><div class="col-4 col-sm-4 mark1">'+
             omarks+
           '</div><hr class = "l1"></div>';
  return code;
}

var URL = location.protocol + '//' + location.host;

var patientsWaitingTableConstructor = [];
var patientsInHospitalTableConstructor = [];
var freeRoomsTableConstructor = [];
var dynamicTableClickable = true;

$(document).ready(function() {
  var patientsAPI = URL + "/app/getpatients";
  $.getJSON(patientsAPI).done(function(patients) {
	  var roomsAPI = URL + "/app/getrooms";
	  $.getJSON(roomsAPI).done(function(rooms1) {

          // iterate through all rooms
	  	  for(var room in rooms1) {
		  	  var freeRoomsRowConstructor = [];

              if (room !== 'noroom' && rooms1[room] === false) {
		  	  	  freeRoomsRowConstructor.push(room);
		  	  	  freeRoomsTableConstructor.push(freeRoomsRowConstructor);
		  	  }
		  }

		  for(var i = 0; i < patients.length; i++) {
			  var patient = patients[i];

			  var patientsRowConstructor = [];
			  patientsRowConstructor.push(patient["hospitalNumber"]);

                 var actualTime = new Date().getTime();
                 var timeDifference = actualTime - patient.lastUpdate;

                 var timeDifferenceInMinutes = Math.abs(timeDifference) / 60 / 1000;

               
                 if (timeDifferenceInMinutes > 1440) {
                    patientsRowConstructor.push("<span class=\"glyphicon glyphicon-warning-sign\" style=\"color: red;\"></span>   " + patient["firstName"] + " " + patient["GuardianName"]);
                 } else {
                    patientsRowConstructor.push(patient["firstName"] + " " + patient["GuardianName"]);
                 }


			  if(patient["room"] === "noroom") {
			  	  patientsRowConstructor.push(patient["Stage"]);

			  	  patientsWaitingTableConstructor.push(patientsRowConstructor);
			  } else {
			  	  patientsRowConstructor.push(patient["room"]);
			  	  patientsRowConstructor.push(patient["Stage"]);

			  	  patientsInHospitalTableConstructor.push(patientsRowConstructor);
			  }
		  }

		  $('#patients-waiting').dataTable({
		       data: patientsWaitingTableConstructor,
		       columns: [{
		       	 title: "<span class=\"fa fa-hospital-o fa-fw\" style=\"color: black;\"></span>   " + "  ID",
                     width: "30%"
		       }, {
		           title: "Pending patients",
                     width: "60%"
		       }, {
		           title: " Current Stage",
                     width: "10%"
		       }],
		       scrollY: '60vh',
		       scrollCollapse: true,
		       paging: false,
		       resposnive: true,
		       info: false,
                 language: {
                   searchPlaceholder: "Search patient waiting...",
                   sSearch: ""
                 },
               aaSorting: [[2, 'desc']],
               fnCreatedRow: function(nRow, aData, iDisplayIndex) {
                  
                   if (aData[2] > 2) { // red
                       $('td:eq(2)', nRow).css("background-color", "#ffad99");
                   } else if (aData[2] >=1) { // orange
                       $('td:eq(2)', nRow).css("background-color", "#ffdd99");
                   } else if (aData[2] >=0) { // yellow
                       $('td:eq(2)', nRow).css("background-color", "#ffffcc");
                   }
               }
		   });

		  $('#patients-in-hospital').DataTable({
   			   data: patientsInHospitalTableConstructor,
		        columns:[{
	                title: "<span class=\"fa fa-hospital-o fa-fw\" style=\"color: black;\"></span>   " + "  ID",
                     width: "25%"
	            },{
	                title: "Name",
                     width: "45%"
	            },{
	           	 title: "Room",
                     width: "15%"
	            },{
	           	 title: "Current Stage",
                     width: "15%"
	            }],
		        scrollY: '60vh',
		        scrollCollapse: true,
		        paging: false,
		        resposnive: true,
		        info: false,
                  language: {
                       searchPlaceholder: "Search patient",
                       sSearch: ""
                },
                aaSorting: [[3, 'desc']],
                fnCreatedRow: function(nRow, aData, iDisplayIndex) {
                  
                    if (aData[3] >= 35) { // red
                        $('td:eq(3)', nRow).css("background-color", "#ffad99");
                    } else if (aData[3] >=20) { // orange
                        $('td:eq(3)', nRow).css("background-color", "#ffdd99");
                    } else if (aData[3] >= 10) { // yellow
                        $('td:eq(3)', nRow).css("background-color", "#ffffcc");
                    }
                }
            });

			//  table with free rooms in the right side
		  $('#free-rooms').dataTable({
			  data: freeRoomsTableConstructor,
			  columns:[{
				  title: "Pending Rooms"
			  }],
			  scrollY: '60vh',
			  scrollCollapse: true,
			  paging: false,
			  resposnive: true,
			  info: false,
                language: {
                     searchPlaceholder: "Search room...",
                     sSearch: ""
              }
		  });

            //   Set dashboard data in the three boxes on the top
            var patientsWithRoomsDashboard = patientsInHospitalTableConstructor.length || 0;
            $("#patients-with-rooms-live").html(patientsWithRoomsDashboard);

            var patientsWaitingDashboard = patientsWaitingTableConstructor.length || 0;
            $("#patients-waiting-live").html(patientsWaitingDashboard);

            var freeRoomsDashboard = freeRoomsTableConstructor.length || 0;
            $("#free-rooms-live").html(freeRoomsDashboard);

	  });
  });
});

$("#patients-waiting").ready(function() {
    $("#patients-waiting > tbody > tr").select(function() {
        $(this).children('td')[3].css({"backgroung-colour": "yellow"});
    });
});

var clicks = 0;

$(function() {
    $("body").on("click", '#patients-in-hospital > tbody > tr', function(e){
         var hospitalNumberToBeWaiting = $(this).children('td')[0];
         hospitalNumberToBeWaiting = hospitalNumberToBeWaiting.textContent;
         clicks++;
         var clicks_when_called = clicks;

           $("body").on('click', '#patients-waiting > tbody > tr', function() {
             var hospitalNumberToBeAdmitted = $(this).children('td')[0];
             hospitalNumberToBeAdmitted = hospitalNumberToBeAdmitted.textContent;
             if (clicks_when_called + 1 === clicks) {
                  if (confirm('Do you want to make the change?')) {
                    window.location.href = URL + "/app/swappatients/" + hospitalNumberToBeWaiting + "/" + hospitalNumberToBeAdmitted;
                  } else {
                    window.location.href = URL +"/app/";
                  }
              }
          });
     });
});

$(function(){
    $("body").on("click", '#patients-waiting > tbody > tr', function(e){
         var hospitalNumberToBeAdmitted = $(this).children('td')[0];
         hospitalNumberToBeAdmitted = hospitalNumberToBeAdmitted.textContent;
         clicks++;

           var clicks_when_called = clicks;
           $("body").on('click', '#free-rooms > tbody > tr', function() {
             var roomToBeOccupied = $(this).children('td')[0];
             roomToBeOccupied = roomToBeOccupied.textContent;
             if (clicks_when_called + 1 === clicks) {
                  if (confirm('Do you want to make the change?')) {
                    window.location.href = URL +"/app/updateroom/" + hospitalNumberToBeAdmitted + "/" + roomToBeOccupied;
                  }
                  else
                  {
                    window.location.href = URL + "/app/";
                  }
              }
              $("body").on('click', '#patients-in-hospital > tbody > tr', function() {
                  var hospitalNumberToBeWaiting = $(this).children('td')[0];
                  hospitalNumberToBeWaiting = hospitalNumberToBeWaiting.textContent;

                  if (clicks_when_called + 1 === clicks) {
                       if (confirm('Do you want to make the change?')) {
                         window.location.href = URL +"/app/swappatients/" + hospitalNumberToBeWaiting + "/" + hospitalNumberToBeAdmitted;
                       } else {
                         window.location.href = URL +"/app/";
                       }
                  }
               });
           });
     });
});

$(function(){
    $("body").on("click", '#free-rooms > tbody > tr', function(e){
           var roomToBeOccupied = $(this).children('td')[0];
           roomToBeOccupied = roomToBeOccupied.textContent;
           clicks++;
           var clicks_when_called = clicks;

           $("body").on('click', '#patients-waiting > tbody > tr', function() {
             var hospitalNumberToBeAdmitted = $(this).children('td')[0];
             hospitalNumberToBeAdmitted = hospitalNumberToBeAdmitted.textContent;
             if (clicks_when_called + 1 === clicks) {
                  if (confirm('Do you want to make the change?')) {
                    window.location.href = URL + "/app/updateroom/" + hospitalNumberToBeAdmitted + "/" + roomToBeOccupied;
                  } else {
                    window.location.href = URL + "/app/";
                  }
              }
           });
     });
});

$("body").on('dblclick', '#patients-in-hospital > tbody > tr', function() {
      var NSnumber = $(this).children('td')[0];
      NSnumber = NSnumber.textContent;
      window.location.href = URL + "/app/patient/" + NSnumber;
});

$("body").on('dblclick', '#patients-waiting > tbody > tr', function() {
     var NSnumber = $(this).children('td')[0];
     NSnumber = NSnumber.textContent;
     window.location.href = URL + "/app/patient/" + NSnumber;
});

/*
     Google analytics
*/
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-97568701-1', 'auto');
ga('send', 'pageview');

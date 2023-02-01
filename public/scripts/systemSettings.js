var URL = location.protocol + '//' + location.host;

$(document).ready(function() {
    var diseasesAPI = URL + "/app/getdiseases/";

    $.getJSON(diseasesAPI).done(function(allDiseases) {
           var diseasesStagesCheckboxes = [];

           for(var disease in allDiseases) {
             var diseaseStageCheckbox = [];
        	   diseaseStageCheckbox[0] = disease;
        	   diseaseStageCheckbox[1] = allDiseases[disease]; // This is the Stage.
             diseaseStageCheckbox[2] = "<input type=\"checkbox\" name=\"DD[]\" value=\"" + disease + "\">";

        	   diseasesStagesCheckboxes.push(diseaseStageCheckbox)
           }

           $('#diseases-table').dataTable({
		      data: diseasesStagesCheckboxes,
		      columns:[{
	              title: "Disease",
                  width: "50%"
	          },{
	              title: "Stage",
                  width: "20%"
	          },{
	              title: "Select",
                  width: "30%"
	          }],
		      scrollY: '40vh',
		      scrollCollapse: true,
		      paging: false,
                info: false,
                language: {
                  searchPlaceholder: "Search disease...",
                  sSearch: ""
                },
		 });
    });
});


// fill the rooms table
$(document).ready(function() {
    var roomsAPI = URL + "/app/getrooms/";

    $.getJSON(roomsAPI).done(function(allRooms) {
           var roomsStagesCheckboxes = [];

           for(var room in allRooms) {
               if (room !== 'noroom') {
                    var roomStageCheckbox = [];
                    roomStageCheckbox[0] = room;
                    roomStageCheckbox[1] = "<input type=\"checkbox\" name=\"RD[]\" value=\"" + room + "\">";

                    roomsStagesCheckboxes.push(roomStageCheckbox);
               }
           }

           $('#rooms-table').dataTable({
		      data: roomsStagesCheckboxes,
		      columns:[{
	              title: "Room",
                  width: "60%"
                },{
	              title: "Select",
                  width: "40%"
	           }],
		      scrollY: '40vh',
		      scrollCollapse: true,
		      paging: false,
                info: false,
                language: {
                  searchPlaceholder: "Search room...",
                  sSearch: ""
                },
		 });
    });
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

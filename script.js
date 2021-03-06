var percentages = {};
var subject;
var learntPercentage;
var consolidatedPercentage;
var topics;
var template;
var fileUploaded = false;


function uploadClick() {
  topics = document.querySelectorAll(".topicLearn").length;
  for (i=0; i<topics; i++) {
    document.querySelectorAll(".topicLearn")[i].checked = false;
    document.querySelectorAll(".topicConsolidate")[i].checked = false;
  }
  document.getElementById("uploadInput").click();
};

function download() {
  fileUploaded = false;
  document.getElementById('uploadButton').disabled = true;
  var link = document.createElement("a");
  document.body.appendChild(link);
  link.href = 'data:text/plain;charset=utf-8,' + JSON.stringify(percentages);
  link.setAttribute('download', 'progress.txt');
  link.style.display = 'none';
  link.click();
  document.body.removeChild(link);
  percentages = {};
  document.getElementById("uploadInput").file = "";
  barReset();
};

function downloadTemplate() {
  var link = document.createElement("a");
  document.body.appendChild(link);
  link.href = 'data:text/plain;charset=utf-8,' + JSON.stringify(percentages);
  link.setAttribute('download', 'progress.txt');
  link.style.display = 'none';
  link.click();
  document.body.removeChild(link);
}

function fileSetup(event) {
  file = event.target;
  var reader = new FileReader();
  reader.onload = () => JSONFormat (reader.result);
  reader.readAsText(file.files[0]);
  fileUploaded = true;
  document.getElementById('uploadButton').disabled = false;
};

function JSONFormat(data) {
  percentages = JSON.parse(data);
  if (!(subject in percentages)){
    percentages[subject] = template;
  };
  learntPercentage = parseInt(percentages[subject].learnt.replace('%', ''));
  consolidatedPercentage = parseInt(percentages[subject].consolidated.replace('%', ''));
  barRefresh();
}

function barReset() {
	document.documentElement.style.setProperty('--learntCompleted', "0");
	document.getElementById("learntText").innerHTML = "0%";
	document.documentElement.style.setProperty('--consolidatedCompleted', "0%");
	document.getElementById("consolidatedText").innerHTML = "0%";
  for (i=0; i<topics; i++) {
    document.querySelectorAll(".topicLearn")[i].checked = false;
    document.querySelectorAll(".topicConsolidate")[i].checked = false;
  }
};

function barRefresh() {
	if (Math.round(parseFloat(percentages[subject].learnt.replace("%", ""))) < 1) {
		percentages[subject].learnt = "0%";
	} else if (Math.round(parseFloat(percentages[subject].learnt.replace("%", ""))) > 99) {
		percentages[subject].learnt = "100%";
	};
	document.documentElement.style.setProperty('--learntCompleted', Math.round(parseFloat(percentages[subject].learnt.replace("%", ""))) + '%');
	document.getElementById("learntText").innerHTML = Math.round(parseFloat(percentages[subject].learnt.replace("%", ""))) + '%';
	document.documentElement.style.setProperty('--consolidatedCompleted', Math.round(parseFloat(percentages[subject].consolidated.replace("%", ""))) + '%');
	document.getElementById("consolidatedText").innerHTML = Math.round(parseFloat(percentages[subject].consolidated.replace("%", ""))) + '%';
	for (i=0; i<topics+1; i++) {
	if(percentages[subject].topicsLearnt[i]) {
	  document.querySelectorAll(".topicLearn")[i-1].checked = true;
	}
	}; 
	for (i=0; i<topics+1; i++) {
	  if(percentages[subject].topicsConsolidated[i]) {
	    document.querySelectorAll(".topicConsolidate")[i-1].checked = true;
	  }
	}; 
};

function learntChange(element) {
  topicNumber = parseInt(element.value);
  if (element.checked) {
    learntPercentage += parseFloat((100 / topics).toFixed(3));
    percentages[subject].learnt = learntPercentage.toString() + '%';
    percentages[subject].topicsLearnt[topicNumber] = true;
  } else {
    learntPercentage -= parseFloat((100 / topics).toFixed(3));
    percentages[subject].learnt = learntPercentage.toString() + '%';
    percentages[subject].topicsLearnt[topicNumber] = false;
  };
  barRefresh();
};

function consolidatedChange(element) {
  topicNumber = parseInt(element.value);
  if (element.checked) {
    consolidatedPercentage +=  parseFloat((100 / topics).toFixed(3));
    percentages[subject].consolidated = consolidatedPercentage.toString() + '%';
    percentages[subject].topicsConsolidated[topicNumber] = true;
  } else {
    consolidatedPercentage -=  parseFloat((100 / topics).toFixed(3));
    percentages[subject].consolidated = consolidatedPercentage.toString() + '%';
    percentages[subject].topicsConsolidated[topicNumber] = false;
  };
  barRefresh();
};
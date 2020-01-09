var today = new Date(); // 오늘 날짜//지신의 컴퓨터를 기준으로
//today 에 Date객체를 넣어줌 //ex)5일  

function prevCalendar() {
  today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  buildCalendar(); // 저번 달 
}

function nextCalendar() {
  today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  buildCalendar(); // 다음 달
}

var tblCalendar = null;
function buildCalendar() { // 현재 달
  var nMonth = new Date(today.getFullYear(), today.getMonth(), 1); // 이번 달의 첫째 날
  var lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // 이번 달의 마지막 날
  tblCalendar = document.getElementById("calendar"); // 테이블 달력을 만들 테이블
  var tblCalendarYM = document.getElementById("current-year-month"); // yyyy년 m월 출력할 곳
  tblCalendarYM.innerHTML = today.getFullYear() + "년 " + (today.getMonth() + 1) + "월"; // yyyy년 m월 출력
  // 기존 테이블에 뿌려진 줄, 칸 삭제

  while (tblCalendar.rows.length > 2) {
    tblCalendar.deleteRow(tblCalendar.rows.length - 1);
  }

  var row = null;
  row = tblCalendar.insertRow();
  var cnt = 0;
  // 1일이 시작되는 칸을 맞추어 줌
  for (i = 0; i < nMonth.getDay(); i++) {
    cell = row.insertCell();
    cell.className = "calTd";
    // cnt = cnt + 1;
    cnt++;
  }

  for (i = 1; i <= lastDate.getDate(); i++) {
    cell = row.insertCell();
    cell.innerHTML = i;
    //console.log(cell);
    var writeDay = "" + today.getFullYear();
    writeDay +=  (today.getMonth() +1).length == 2? (today.getMonth() +1) : "0" + (today.getMonth() +1);
    writeDay +=  ("" + i).length == 2? i : "0" + i;
    // console.log("비교대상" + writeDay);
    //cell.className = "calTd";
    var doEx = dateCheck(writeDay);
    //console.log(doEx);
    if(doEx){
      cell.className = "active";
    }
    // cnt = cnt + 1;
    cnt++;
    if (cnt % 7 == 0) // 1주일이 7일 이므로
      row = calendar.insertRow(); // 줄 추가
  }

}

var v_boardData = [];
var v_tblName = "ExerciseJournal";
var viewChangeButton = null;
var boardViewDiv = null;

window.onload = function () {
  //    alert(localStorage.getItem(v_tblName));  // 값이 없을 때 확인! -> null return!
  this.console.log((v_tblName + sessionStorage.getItem('id')));
  var v_objStr = localStorage.getItem((v_tblName + sessionStorage.getItem('id')));
  //this.console.log(v_objStr);
  if (v_objStr != null && v_objStr.length > 2) {
    v_boardData = JSON.parse(v_objStr); // return한 값이 배열!
    readContents(v_boardData[v_boardData.length -1].priKey, 'read');
  } else {
    document.getElementById("input-list").innerHTML = "Guest 거나 운동 기록이 없는 경우<br>프로그램 사용법";
  }
  this.console.log(v_boardData);

  var prevLavel = document.getElementById("prev");
  prevLavel.addEventListener("click", prevCalendar);
  
  var nextLavel = document.getElementById("next");
  nextLavel.addEventListener("click", nextCalendar);
  
  var loginSpan = this.document.getElementById("loginSpan");

  var writer = sessionStorage.getItem('id');
  if(writer != null){
    document.getElementById("id").innerHTML = "[" + writer +"]님";
    loginSpan.innerHTML = "[로그아웃]";
    loginSpan.removeEventListener("click", loginFt); 
    loginSpan.addEventListener("click", logoutFt);
  } else {
    document.getElementById("id").innerHTML = "Guest";
    loginSpan.addEventListener("click", loginFt);
  }
  
  viewChangeButton = document.getElementById("viewChangeButton");
  viewChangeButton.addEventListener("click", changeBoardView);
  
  this.document.getElementById("doExercise").addEventListener("click", openTMSqurt)

  boardViewDiv = document.getElementById("id_disp");
  boardViewDiv.style.display = "none";
  
  buildCalendar();
}

function dateCheck(wDay) {
  //console.log(v_boardData.length);
  for(var i = 0; i < v_boardData.length; i++) {
    // console.log(v_boardData[i].regDate);
    if(v_boardData[i].regDate == wDay){
      return true;
    }
  }
  return false;
}

function logoutFt() {
  sessionStorage.removeItem('id');
  location.reload();
  // /home/pc35/Documents/HTML5+CSS3/WORKSPACE/JavaScript/게시판 만들기/reg.html
}

function changeBoardView() {
  //alert('난 달력이야');
  viewChangeButton.innerHTML = "달력으로";
  viewChangeButton.removeEventListener("click", changeBoardView); 
  viewChangeButton.addEventListener("click", changeCalendarView);
  f_list();
  tblCalendar.style.display = "none";
  boardViewDiv.style.display = "table";
}

function changeCalendarView() {
  //alert('난 보드야?');
  viewChangeButton.innerHTML = "보드로";
  viewChangeButton.removeEventListener("click", changeCalendarView); 
  viewChangeButton.addEventListener("click", changeBoardView);
  buildCalendar();
  tblCalendar.style.display = "table";
  boardViewDiv.style.display = "none";
}


var i = 0;
var selectPage = 1;
var pageInterval = 1;
function f_list(){
  var perPage = 3;
  var pageLength = 3;
  var pageNum = Math.ceil(v_boardData.length / perPage);
  var viewPage = (perPage * selectPage) < v_boardData.length? (perPage * selectPage) : v_boardData.length;
  // console.log(perPage * (selectPage -1));
  // console.log(viewPage);
  var v_tblStr = '<table id="boardList" class="boardTable">';
  v_tblStr += '<colgroup><col style= "width: 20%;"><col style= "width: 60%;"><col style= "width: 20%;"></colgroup>'
  v_tblStr += "<thead><tr><th>순번</th><th>활동 내역</th><th>등록일자</th></tr></thead><tbody>";
  // for(var i=0; i<v_boardData.length; i++){
    if( v_boardData.length == 0){
      v_tblStr = "<td colspan='3'><h4>운동 내역이 없습니다.</h4></td></tbody>"
    } else {
    v_boardData.reverse();
    for(var i= perPage * (selectPage -1); i < viewPage; i++){
        v_tblStr += "<tr>";
        v_tblStr += "<td>"+ (i+1) +"</td>";
        v_tblStr += '<td ><pre onclick="read(this)">' + v_boardData[i].title +'</pre></td>';
        // v_tblStr += '<td ><input type="button" onclick="read(this)" value=' + v_boardData[i].title +'></td>';
        v_tblStr += "<td>"+ v_boardData[i].regDate +"</td>";
        v_tblStr += "</tr>";
    }
    v_tblStr += '</tbody><tfoot><tr><td colspan="3"><div class="links">';
    var startNum = (pageInterval-1)*pageLength +1;
    var endNum = startNum + pageLength < v_boardData.length? startNum + pageLength:v_boardData.length;
    //console.log("startNum:" + startNum);
    //console.log("pageLength:" + pageLength);

    var cnt = 0;
    if(pageInterval > 1){
        v_tblStr += '<span onclick="prePageInterval()">[이전]</span>';
    }
    for(var i = startNum; i < endNum; i++){
        v_tblStr += '<span onclick="pageFt(this)">' + i + "</span> ";
        cnt++;
        if(i * perPage >= v_boardData.length){
            break;
        }
        if(cnt == pageLength && (pageLength *  pageInterval * perPage) < v_boardData.length){
            v_tblStr += '<span onclick="nextPageInterval()">[다음]</span>';
        }
    }
    v_tblStr += "</div></td></tr></tfoot></table>";
    v_boardData.reverse();
  }     
    document.getElementById("id_disp").innerHTML = v_tblStr;
}

function writerContent() {
  // window.open("boardWriteUpdate.html", "_blank", "width=800,height=500");
  load("boardWriteUpdate.html");
}

function read(element){
  if(isNaN(element)) { 
      var table = document.getElementById("boardList");
      var row = element.closest('tr').rowIndex;
      var priKeyValue = table.rows[row].cells[2].innerHTML;
      for(var j=0; j < v_boardData.length; j++){
        if(priKeyValue == v_boardData[j].regDate){
          priKeyValue = v_boardData[j].priKey;
          break;
        }
      }
      // alert(priKeyValue + " 읽는다");
  } else {
      var priKeyValue = element;
  }
  readContents(priKeyValue, 'read');
  //window.open(("boardRead.html?priKeyValue=" + priKeyValue), "_parent");
}

function loginFt() {
  sessionStorage.removeItem('id');
  window.open("reg.html", "_blank", "width=660, height=270");
}

function pageFt(e) {
  selectPage = e.innerHTML;
  selectPage = selectPage.substring(1, selectPage.length-1);
  //console.log(selectPage);
  f_list();
}

function nextPageInterval() {
  pageInterval++;
  f_list();
}

function prePageInterval() {
  pageInterval--;
  f_list();
}

function readContents(priKeyValue, modeFlag){
  //console.log(priKeyValue);
  var i = 0;
  var v_tblStr = "";
  if( priKeyValue == 0){
    v_tblStr = "<h4>운동 내역이 없습니다.</h4>"
  } else {
    for(i = 0; i<v_boardData.length; i++){
        if(v_boardData[i].priKey == priKeyValue){
            v_tblStr = "<table class='boardTable'>";
            v_tblStr += '<colgroup><col style= "width: 30%;"><col style= "width: 69%;"></colgroup>'
            v_tblStr += "<thead><tr><th>활동내역</th>";
            v_tblStr += "<td>" + v_boardData[i].title + "</td></tr>";
            writer = v_boardData[i].writer;
            v_tblStr += "<tr><th>작성일</th>";
            v_tblStr += "<td>" + v_boardData[i].regDate + "</td></tr></thead>";
            if(modeFlag == 'read'){
              v_tblStr += '<tbody><tr><td colspan="2">' + v_boardData[i].contents + "</td></tr><tbody>";
              v_tblStr += '<tfoot><tr><td colspan="2"><div class="links"><input type=button class="myButton2" value="수정" onclick="readContents(' + priKeyValue;
              v_tblStr += ', \'update\')">';
              v_tblStr += '<input type=button class="myButton2" value="삭제" onclick="removeContent('+priKeyValue+')"></div></td></tr></tfoot></table>';
              //v_boardData [i].cnt++;   
            } else {
              v_tblStr += '<tbody><tr><td colspan="2"><textarea id="content"cols="40" rows="5"></textarea></td></tr><tbody>';
              v_tblStr += '<tfoot><tr><div class="links"><td colspan="2"><input type=button class="myButton2" id="saveUdateButton" value="수정" onclick="updateContentFt('+i+')">';
              v_tblStr += '<input type=button class="myButton2" value="닫기" onclick="readContents(' + priKeyValue + ', \'read\')"></div></td></tr></tfoot></table>';
            }        
            break;
        }
    }
  }
  
  document.getElementById("input-list").innerHTML = v_tblStr;

  if(modeFlag == "update"){
    document.getElementById("content").value = v_boardData[i].contents; 
  }
  //localStorage는 JSON을 저장할 수 없으므로 문자열로 변환!
  v_objStr = JSON.stringify(v_boardData);  

  //저장!
  localStorage.setItem(v_tblName, v_objStr);
  f_list();      
}

function openTMSqurt(){
  window.open("./Teachable-Machine-AI-Fitness-Trainer-master/index.html?id="+ sessionStorage.getItem('id'), "_blank");
}

function removeContent(priKeyValue) {
  for(var i = 0; i<v_boardData.length; i++){
      if(v_boardData[i].priKey == priKeyValue){
          alert(v_boardData[i].regDate+ "의 기록을 삭제합니다.");
          v_boardData.splice(i, 1);
          break;
      }
  }
  v_objStr = JSON.stringify(v_boardData);  
  localStorage.setItem(v_tblName, v_objStr);
  f_list();
  readContents((priKeyValue -1), 'read');
}

function f_save(flag){
  switch(flag) {
      case '저장':
          //alert('쓰기모드');
          var v_title = document.getElementById("title").value;
          var toDay = new Date();
          var v_board = {};    // 빈 JSON객체 생성, 데이타를 묶어주기 위함!

          if( v_title == null || v_title.length == 0){
              alert('제목은 반드시 입력 해야합니다.');
              document.getElementById("title").focus();
              return;
          }
          
          v_board.priKey = priKeyNum++;
          /* 오늘의 과제 고유키값 순번대로 증가하도록 DB의 auto increment 처럼 자동 증가하도록 */ 
          v_board.title = v_title;
          v_board.writer = writer;
          v_board.cnt = 0;
          v_board.regDate = "" + toDay.getFullYear();
          v_board.regDate +=  (toDay.getMonth() +1).length == 2? (toDay.getMonth() +1) : "0" + (toDay.getMonth() +1);
          v_board.regDate +=  toDay.getDate().length == 2? toDay.getDate() : "0" + toDay.getDate();
          //v_board.regDate = "20200104"; // 입력날짜 테스트 "YYYYMMDD";
          // v_board.contents = "csv 파일에서 읽을 부분 정보";
          v_board.contents = document.getElementById("content").value;
          
          v_boardData.push(v_board); // 객체를 배열에 추가

          //localStorage는 JSON을 저장할 수 없으므로 문자열로 변환!
          v_objStr = JSON.stringify(v_boardData);  

          //저장!
          localStorage.setItem(v_tblName, v_objStr);
          //i++;

          /*  좋지 않은 예! , 데이타가 다 따로 놀고 있음!
          localStorage.setItem("name"+i,v_name);
          localStorage.setItem("age"+i,v_age);
          localStorage.setItem("alias"+i,v_alias);
          i++;   // key값이 달라지도록..
          */
          break;

      case '수정':
          //alert('수정모드');
          updateContentFt();
          break;
  }

  window.close();
}

function updateContentFt(i) {
  v_boardData[i].contents = document.getElementById("content").value;
  
  v_objStr = JSON.stringify(v_boardData);  
  localStorage.setItem(v_tblName, v_objStr);
  
  //alert(v_boardData[i].priKey + "번 글을 수정했습니다.");
  readContents(v_boardData[i].priKey, 'read');
}
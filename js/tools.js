/** The goal of this file is to keep track of various js tools not related to the project. */

/** Load xml file */
function loadXMLDoc(filename){
    if (window.XMLHttpRequest){
        xhttp=new XMLHttpRequest();
    }else{// code for IE5 and IE6
        xhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET",filename,false);
    xhttp.send();
    return xhttp.responseXML;
}

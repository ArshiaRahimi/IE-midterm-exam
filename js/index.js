/* declaration of normal buttons, text boxes, radio buttons and ...
* used id of its elements to put it in constants*/
const nameSubmitButton = document.getElementById("nameSubmit")
const nameInputTextBox = document.getElementById("nameLabel")
const errorMessageText = document.getElementById("error")
const saveButton = document.getElementById("saveId")
const savedValue = document.getElementById("savedValue")
const maleRadio = document.getElementById("male")
const femaleRadio = document.getElementById("female")
const eraseButton = document.getElementById("eraseId")

/* setGender gets a name from text box then checks if it's null or not. check if it's length is not more than 255
* and check if its valid or not(characters and whitespaces are allowed/ used regular expression to validate it).
* after the validations, if no cookies are available for that name, results boxes are filled with api's response.
* if there is a cookie for that name, results are filled with cookie values instead */
function setGender() {
    savedValue.textContent = ""
    let regex = /^([a-zA-Z\s])*$/
    let name = nameInputTextBox.value;
    if (name ==="" || name.length>255 || regex.test(name) == false){
        errorMessage()
        setTimeout(fadeOut, 2000);
    }else{
        let cookie = getCookie(name)
        if (cookie != null){
            savedValue.textContent =  name + " is " + getCookie(name);
            document.getElementById("resId").innerHTML = getCookie(name) + " (saved)"
        }else {
            getUserData(name).then(json => document.getElementById("resId").innerHTML = json.gender)
            getUserData(name).then(json => document.getElementById("resId2").innerHTML = json.probability)
        }
    }
}

/* this function calls the genderize api. sets a name and gets a response(json)*/
async function getUserData(username) {
    console.log("request");
    try {
        let response = await fetch(`https://api.genderize.io/?name=${username}`)
        let json = await response.json();
        if (response.status == 200) {
            return json
        }
        return Promise.reject(`Request failed with error ${response.status}`);
    } catch (e) {
        console.log(e);
    }
}

/*this function is responsible for setting cookies. used document.cookie to set a key(name) and value(gender)*/
function setCookie() {
    let name = nameInputTextBox.value;
    let regex = /^([a-zA-Z\s])*$/
    let gender = document.getElementById("resId").value
    if (name ==="" || name.length>255 || regex.test(name) == false){
        errorMessage()
        setTimeout(fadeOut, 2000);
    }else{
        if (gender === "male" || gender === "female"){
            document.cookie = name + "=" + gender + "; path=/";
            savedValue.textContent =  name + " is " + getCookie(name);
        }
    }
}
/* this function gets a name and return its cookie*/
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

/* this function gets a name and deletes it's cookie. the year is set to 1970 to make the cookie expire immediately*/
function eraseCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
/* this function fills error box message*/
function errorMessage() {
    errorMessageText.textContent = "Please a valid name"
    errorMessageText.style.color = "red"
}

function fadeOut(){
    errorMessageText.textContent = ""
}
/* maleRadioHandler triggers when male's radio button is pressed. it checks names legitimacy and fills results boxes*/
function maleRadioHandler(){
    let name = nameInputTextBox.value;
    let regex = /^([a-zA-Z\s])*$/
    if (name ==="" || name.length>255 || regex.test(name) == false){
        errorMessage()
        setTimeout(fadeOut, 2000);
    }else {
        document.getElementById("resId").innerHTML = "male"
        document.getElementById("resId2").innerHTML = "User's choice"
    }
}
/* femaleRadioHandler is very similar to maleRadioHandler*/
function femaleRadioHandler(){
    let name = nameInputTextBox.value;
    let regex = /^([a-zA-Z\s])*$/
    if (name ==="" || name.length>255 || regex.test(name) == false){
        errorMessage()
        setTimeout(fadeOut, 2000);
    }else {
        document.getElementById("resId").innerHTML = "female"
        document.getElementById("resId2").innerHTML = "User's choice"
    }
}
/* eraseButtonHandler triggers when Clear button is pressed. it fetches the name and delete its cookie*/
function eraseButtonHandler(){
    let saveValue = savedValue.textContent
    if (saveValue !== ""){
        saveValue = saveValue.split(" is ")[0];
        eraseCookie(saveValue)
        savedValue.textContent = ""
    }


}

/* event listeners will trigger a function based on its button(on click) t*/
nameSubmitButton.addEventListener("click", setGender)
saveButton.addEventListener("click", setCookie)
maleRadio.addEventListener("click", maleRadioHandler)
femaleRadio.addEventListener("click", femaleRadioHandler)
eraseButton.addEventListener("click", eraseButtonHandler)
console.log("TypeScript Input from User");

function submitData() {
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const phone = (document.getElementById("phone") as HTMLInputElement).value; 
    console.log("Name: " + name);
    console.log("Email: " + email);
    console.log("Phone Number: " + phone);
}
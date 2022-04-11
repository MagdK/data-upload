const parseJSON = async (url) => {
    //változóba mentjük a fetchet
    const response = await fetch(url);
    return response.json();
};


//objectumból kibontjuk(destructuring) a kulcsait: ({name, surname})
const userComponent = ({firstName, surname}) => {
    return `
        <div>
            <h1>${firstName}</h1>
            <h2>${surname}</h2>
        </div>
    `
};


function addUserComponent() {
    return `
        <div>
            <input type="text" name="firstName" placeholder="First name">
            <input type="text" name="surname" placeholder="Surname">
            <button id="submit-data">Send</button>
        </div>
    `
};


const loadEvent = async () => {

    const result = await parseJSON('/api/v1/users');
    const rootElement = document.getElementById("root");
    

    rootElement.insertAdjacentHTML(
        "beforeend", 
        result.map(user => userComponent(user)).join("")
    );

    rootElement.insertAdjacentHTML("afterend",  addUserComponent());

    const dataSubmitButton = document.getElementById("submit-data");
    const firstName = document.querySelector(`input[name="firstName"]`);
    const surname = document.querySelector(`input[name="surname"]`);

    dataSubmitButton.addEventListener("click", e => {
        const userData = {
            firstName: firstName.value,
            surname: surname.value
        };

        fetch("/users/new", {
            method: "POST",
            // uresen ment at, express nem tamogatja, ezert adtuk meg ezt a headers-ben a content-type -ot
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(async data => {
            const user = await data.json();
            rootElement.insertAdjacentHTML("beforeend", userComponent(user))
        })
    })
};

window.addEventListener("load", loadEvent);
window.addEventListener("load", function () {
    const page = window.location.pathname.substring(1);
    const rootElement = document.getElementById("root");
    console.log(page);
    if (page == "") {
        rootElement.innerHTML = "Art Club Information";
        rootElement.insertAdjacentHTML('beforeend',
            `
            <h2>Welcome to the ART Club!</h2>
            <p>Join our vibrant community of artists and art enthusiasts. Explore your creativity and share your passion for art with others.</p>
            <p>Here are some of the activities you can participate in:</p>
            <ul>
                <li>Art workshops</li>
                <li>Exhibitions showcasing members' artwork</li>
                <li>Art appreciation sessions</li>
                <li>Collaborative projects</li>
            </ul>
            <p>Get involved and unleash your artistic potential by becoming a membership!</p>
            `
        );
    }
    
    else if (page == "newuser") {
        rootElement.innerHTML = ""
        rootElement.insertAdjacentHTML('beforeend',
            `
        <h2>Create Account</h2>
        <form id="newUserForm">
            <label>Name:</label>
            <input type="text" id="name" required><br>
            <label>Surname:</label>
            <input type="text" id="surname" required><br>
            <label>Username:</label>
            <input type="text" id="username" required><br>
            <label>Email:</label>
            <input type="email" id="email" required><br>
            <label>Password:</label>
            <input type="password" id="password" required><br>
            <button type="submit">Create User</button>
        </form>
        `)
    }
});

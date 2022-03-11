"use strict";
(function () {
    function AuthGuard() {
        let protectedRoutes = [
            "contact-list"
        ];
        if (protectedRoutes.indexOf(router.ActiveLink) > -1) {
            if (!sessionStorage.getItem("user")) {
                router.ActiveLink = "login";
            }
        }
    }
    function LoadLink(link, data = "") {
        router.ActiveLink = link;
        AuthGuard();
        router.LinkData = data;
        history.pushState({}, "", router.ActiveLink);
        document.title = router.ActiveLink.substring(0, 1).toUpperCase() +
            router.ActiveLink.substring(1);
        $("ul>li>a").each(function () {
            $(this).removeClass("active");
        });
        $(`li>a:contains(${document.title})`).addClass("active");
        LoadContent();
    }
    function AddNavigationEvents() {
        let navLinks = $("ul>li>a");
        navLinks.off("click");
        navLinks.off("mouseover");
        navLinks.on("click", function () {
            LoadLink($(this).attr("data"));
        });
        navLinks.on("mouseover", function () {
            $(this).css("cursor", "pointer");
        });
    }
    function AddLinkEvents(link) {
        let linkQuery = $(`a.link[data=${link}]`);
        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");
        linkQuery.css("text-decoration", "underline");
        linkQuery.css("color", "blue");
        linkQuery.on("click", function () {
            LoadLink(`${link}`);
        });
        linkQuery.on("mouseover", function () {
            $(this).css("cursor", "pointer");
            $(this).css("font-weight", "bold");
        });
        linkQuery.on("mouseout", function () {
            $(this).css("font-weight", "normal");
        });
    }
    function LoadHeader() {
        $.get("./Views/components/header.html", function (htmlData) {
            $("header").html(htmlData);
            AddNavigationEvents();
            CheckLogin();
        });
    }
    function LoadContent() {
        let pageName = router.ActiveLink;
        let callback = ActiveLinkCalLBack();
        $.get(`./Views/content/${pageName}.html`, function (htmlData) {
            $("main").html(htmlData);
            CheckLogin();
            callback();
        });
    }
    function LoadFooter() {
        $.get("./Views/components/footer.html", function (htmlData) {
            $("footer").html(htmlData);
        });
    }
    function DisplayHome() {
        console.log("Home Page");
        $("#AboutUsButton").on("click", () => {
            LoadLink("about");
        });
        $("main").append(`<p id="MainParagraph" class="mt-3">The is the main paragraph</p>`);
        $("main").append(`<article><p id="ArticleParagraph" class="mt-3">This is the article paragraph</p></article>`);
        let cody = new core.Contact("Cody", "12334567890", "cody@sdf.com");
        console.log(cody.toString());
    }
    function DisplayAboutPage() {
        console.log("About Us Page");
    }
    function DisplayProjectsPage() {
        console.log("Projects Page");
    }
    function DisplayServicesPage() {
        console.log("Services Page");
    }
    function AddContact(fullName, contactNumber, emailAddress) {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            let key = contact.FullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }
    function ValidateField(inputFieldID, regex, errorMessage) {
        let messageArea = $("#messageArea").hide();
        $("#" + inputFieldID).on("blur", function () {
            let inputFieldText = $(this).val();
            if (!regex.test(inputFieldText)) {
                $(this).trigger("focus").trigger("select");
                messageArea.show().addClass("alert alert-danger").text(errorMessage);
            }
            else {
                messageArea.removeAttr("class").hide();
            }
        });
    }
    function ContactFormValidation() {
        ValidateField("fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]{1,})+([\s|,|-]([A-Z][a-z]{1,}))*$/, "Please enter a valid name");
        ValidateField("contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]?\d{4}$/, "Please enter a valid contact number");
        ValidateField("emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid email address");
    }
    function DisplayContactPage() {
        console.log("Contact Us Page");
        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function () {
            LoadLink("contact-list");
        });
        ContactFormValidation();
        if (sessionStorage.getItem("user")) {
            $("#showContactListButton").removeAttr("style");
        }
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");
        sendButton.addEventListener("click", function () {
            if (subscribeCheckbox.checked) {
                let fullName = document.forms[0].fullName.value;
                let contactNumber = document.forms[0].contactNumber.value;
                let emailAddress = document.forms[0].emailAddress.value;
                AddContact(fullName, contactNumber, emailAddress);
            }
        });
    }
    function DisplayContactListPage() {
        console.log("Contact-List Page");
        if (localStorage.length > 0) {
            let contactList = document.getElementById("contactList");
            let data = "";
            let keys = Object.keys(localStorage);
            let index = 1;
            for (const key of keys) {
                let contactData = localStorage.getItem(key);
                let contact = new core.Contact();
                contact.deserialize(contactData);
                data += `<tr>
                <th scope="row" class="text-center">${index}</th>
                <td>${contact.FullName}</td>
                <td>${contact.ContactNumber}</td>
                <td>${contact.EmailAddress}</td>
                <td class="text-center">
                    <button value="${key}" class="btn btn-primary btn-sm edit"><i class="fas fa-edit fa-sm"></i> Edit</button>
                </td>
                <td class="text-center">
                    <button value="${key}" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt fa-sm"></i> Delete</button>
                </td>
                </tr>`;
                index++;
            }
            contactList.innerHTML = data;
            $("button.edit").on("click", function () {
                LoadLink("edit", $(this).val());
            });
            $("button.delete").on("click", function () {
                if (confirm("Are you sure?")) {
                    localStorage.removeItem($(this).val());
                }
                LoadLink("contact-list");
            });
        }
        $("#addButton").on("click", () => {
            LoadLink("edit", "add");
        });
    }
    function DisplayEditPage() {
        ContactFormValidation();
        let page = router.LinkData;
        switch (page) {
            case "add":
                {
                    $("main>h1").text("Add Contact");
                    $("#editButton").html(`<i class="fas fa-plus-circle fe-lg"></i> Add`);
                    $("#editButton").on("click", (event) => {
                        event.preventDefault();
                        let fullName = document.forms[0].fullName.value;
                        let contactNumber = document.forms[0].contactNumber.value;
                        let emailAddress = document.forms[0].emailAddress.value;
                        AddContact(fullName, contactNumber, emailAddress);
                        LoadLink("contact-list");
                    });
                    $("#cancelButton").on("click", () => {
                        LoadLink("contact-list");
                    });
                }
                break;
            default:
                {
                    let contact = new core.Contact();
                    contact.deserialize(localStorage.getItem(page));
                    $("#fullName").val(contact.FullName);
                    $("#contactNumber").val(contact.ContactNumber);
                    $("#emailAddress").val(contact.EmailAddress);
                    $("#editButton").on("click", (event) => {
                        event.preventDefault();
                        contact.FullName = $("#fullName").val();
                        contact.ContactNumber = $("#contactNumber").val();
                        contact.EmailAddress = $("#emailAddress").val();
                        localStorage.setItem(page, contact.serialize());
                        LoadLink("contact-list");
                    });
                    $("#cancelButton").on("click", () => {
                        LoadLink("contact-list");
                    });
                }
                break;
        }
    }
    function CheckLogin() {
        if (sessionStorage.getItem("user")) {
            $("#login").html(`<a id="logout" class="nav-link" data="logout"><i class="fas fa-sign-out-alt"></i> Logout</a>`);
            AddNavigationEvents();
            $("#logout").on("click", function () {
                sessionStorage.clear();
                $("#login").html(`<a class="nav-link" data="login"><i class="fas fa-sign-in-alt"></i> Login</a>`);
                AddNavigationEvents();
                LoadLink("login");
            });
        }
    }
    function DisplayLoginPage() {
        console.log("Login page");
        let messageArea = $("messageArea");
        messageArea.hide();
        AddLinkEvents("register");
        $("#loginButton").on("click", function () {
            let success = false;
            let newUser = new core.User();
            let username = document.forms[0].username.value;
            let password = document.forms[0].password.value;
            $.get("./Data/users.json", function (data) {
                for (const user of data.users) {
                    if (username == user.Username && password == user.Password) {
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.removeAttr("class").hide();
                    LoadLink("contact-list");
                }
                else {
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("Error: Invalid login credentials").show();
                }
            });
        });
        $("cancelButton").on("click", function () {
            document.forms[0].reset();
            LoadLink("home");
        });
    }
    function DisplayRegisterPage() {
        console.log("Register page");
        AddLinkEvents("login");
    }
    function Display404() {
    }
    function ActiveLinkCalLBack() {
        switch (router.ActiveLink) {
            case "home": return DisplayHome;
            case "about": return DisplayAboutPage;
            case "projects": return DisplayProjectsPage;
            case "services": return DisplayServicesPage;
            case "contact-list": return DisplayContactListPage;
            case "contact": return DisplayContactPage;
            case "edit": return DisplayEditPage;
            case "login": return DisplayLoginPage;
            case "register": return DisplayRegisterPage;
            case "404": return Display404;
            default:
                console.error("ERROR: callback does not exist" + router.ActiveLink);
                return new Function();
        }
    }
    function Start() {
        console.log("App Started!");
        LoadHeader();
        LoadLink("home");
        LoadFooter();
    }
    window.addEventListener("load", Start);
})();
//# sourceMappingURL=app.js.map
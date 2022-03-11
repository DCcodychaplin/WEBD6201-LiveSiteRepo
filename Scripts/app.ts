// IIFE - Immediately Invoked Function Expession
// OR Anonymous self-executing function
// ctrl + shift + B to Transpile (watch)
"use strict";
(function()
{
    function AuthGuard(): void
    {
        let protectedRoutes = [
            "contact-list"
        ];
    
        if (protectedRoutes.indexOf(router.ActiveLink) > -1)
        {        
            // if not logged in
            if (!sessionStorage.getItem("user"))
            {
                // change link to login
                router.ActiveLink = "login";
            }
        }
    }

    function LoadLink(link: string, data: string = ""): void
    {
        router.ActiveLink = link;

        AuthGuard();

        router.LinkData = data;
        history.pushState({}, "", router.ActiveLink);

        // capitalizes router ActiveLink and sets title to it
        document.title = router.ActiveLink.substring(0,1).toUpperCase() +
            router.ActiveLink.substring(1);

        // remove all active links
        $("ul>li>a").each(function()
        {
            $(this).removeClass("active");
        });

        // lets current link as active
        $(`li>a:contains(${document.title})`).addClass("active");

        LoadContent();
    }

    function AddNavigationEvents(): void
    {
        let navLinks = $("ul>li>a"); // gets all nav links

        // remove active events
        navLinks.off("click");
        navLinks.off("mouseover");

        // loop through navLinks and load corresponding content
        navLinks.on("click", function()
        {
            LoadLink($(this).attr("data") as string);
        });

        // make navLinks look clickable
        navLinks.on("mouseover", function()
        {
            $(this).css("cursor", "pointer");
        });
    }

    function AddLinkEvents(link: string): void
    {
        let linkQuery = $(`a.link[data=${link}]`);

        // remove all link events
        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");

        // make links look like links
        linkQuery.css("text-decoration", "underline");
        linkQuery.css("color", "blue");

        // add link events
        linkQuery.on("click", function()
        {
            LoadLink(`${link}`);
        });

        linkQuery.on("mouseover", function()
        {
            $(this).css("cursor", "pointer");
            $(this).css("font-weight", "bold");
        });

        linkQuery.on("mouseout", function()
        {
            $(this).css("font-weight", "normal");
        });
    }

    /**
     * Loads navbar from header file and injects header/html into page
     *
     */
    function LoadHeader(): void
    {
        $.get("./Views/components/header.html", function(htmlData)
        {
            $("header").html(htmlData);

            AddNavigationEvents();
            
            CheckLogin();
        });
    }

    /**
     * Loads page content
     *
     * @returns {void}
     */
    function LoadContent(): void
    {
        let pageName: string = router.ActiveLink;
        let callback: Function = ActiveLinkCalLBack();

        $.get(`./Views/content/${pageName}.html`, function(htmlData)
        {
            $("main").html(htmlData);

            CheckLogin();

            callback();
        });
    }

    /**
     * Loads footer
     *
     * @returns {void}
     */
    function LoadFooter(): void
    {
        $.get("./Views/components/footer.html", function(htmlData)
        {
            $("footer").html(htmlData);
        });
    }

    function DisplayHome(): void
    {
        console.log("Home Page");

        // redirects to about.html on button click
        $("#AboutUsButton").on("click", () => 
        {
            LoadLink("about");
        });
        
        // adds content to page
        $("main").append(`<p id="MainParagraph" class="mt-3">The is the main paragraph</p>`);
        $("main").append(`<article><p id="ArticleParagraph" class="mt-3">This is the article paragraph</p></article>`);

        // creates a contact and logs details to console
        let cody = new core.Contact("Cody", "12334567890", "cody@sdf.com");
        console.log(cody.toString());
    }

    function DisplayAboutPage(): void
    {
        console.log("About Us Page");
    }

    function DisplayProjectsPage(): void
    {
        console.log("Projects Page");
    }

    function DisplayServicesPage(): void
    {
        console.log("Services Page");
    }

    /**
     * Adds a Contact Object to localStorage
     * 
     * @param {string} fullName 
     * @param {string} contactNumber 
     * @param {string} emailAddress 
     */
    function AddContact(fullName: string, contactNumber: string, emailAddress: string)
    {
        // generates unique key and stores serialized contact in localStorage
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
            if (contact.serialize())
            {
                let key = contact.FullName.substring(0, 1) + Date.now();

                localStorage.setItem(key, contact.serialize());
            }
    }
    /**
     * Validates an input text field in the form and displays an error in the message area
     *
     * @param {string} inputFieldID
     * @param {RegExp} regex
     * @param {string} errorMessage
     */
    function ValidateField(inputFieldID: string, regex: RegExp, errorMessage: string)
    {
        let messageArea = $("#messageArea").hide();
        
        $("#" + inputFieldID).on("blur", function()
        {
            let inputFieldText: string = $(this).val() as string;
            if (!regex.test(inputFieldText))
            {
                $(this).trigger("focus").trigger("select");
                messageArea.show().addClass("alert alert-danger").text(errorMessage);
            }
            else
            {
                messageArea.removeAttr("class").hide();
            }
        });
    }

    function ContactFormValidation()
    {
        // validate using full name regex
        ValidateField("fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]{1,})+([\s|,|-]([A-Z][a-z]{1,}))*$/,
        "Please enter a valid name");
    
        // validate using phone number regex
        ValidateField("contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]?\d{4}$/,
            "Please enter a valid contact number");

        // validate using email address regex
        ValidateField("emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/,
            "Please enter a valid email address");
    }

    function DisplayContactPage()
    {
        console.log("Contact Us Page");

        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function()
        {
            LoadLink("contact-list");
        });

        ContactFormValidation(); // validate input

        // only displays button if logged in
        if (sessionStorage.getItem("user"))
        {
            $("#showContactListButton").removeAttr("style");
        }

        // gets references
        let sendButton = document.getElementById("sendButton") as HTMLElement;
        let subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement;

        // if subscribeCheckbox is checked, add contact to localStorage
        sendButton.addEventListener("click", function()
        {
            if (subscribeCheckbox.checked)
            {
                let fullName = document.forms[0].fullName.value as string;
                let contactNumber = document.forms[0].contactNumber.value as string;
                let emailAddress = document.forms[0].emailAddress.value as string;
                AddContact(fullName, contactNumber, emailAddress);
            }
        });
    }

    function DisplayContactListPage()
    {
        console.log("Contact-List Page");

        if (localStorage.length > 0)
        {
            let contactList = document.getElementById("contactList") as HTMLElement; // table body
            let data = ""; // data container
            let keys = Object.keys(localStorage); // returns string[] of keys
            let index = 1; // key count

            for (const key of keys)
            {
                let contactData = localStorage.getItem(key); // get item associated with key

                // create and deserialize contact
                let contact = new core.Contact();
                contact.deserialize(contactData as string);

                // add html
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
                
                index++; // increment counter
            }

            contactList.innerHTML = data; // add table row

            // redirects to edit.html on button click, stores key in hash
            $("button.edit").on("click", function()
            {
                LoadLink("edit", $(this).val() as string);
            });

            // removes item associated with key from localStorage and redirects to contact-list.html
            $("button.delete").on("click", function()
            {
                if (confirm("Are you sure?"))
                {
                    localStorage.removeItem($(this).val() as string);
                }

                LoadLink("contact-list");
            });
        }

        // redirects to edit.html on button click, stores "add" in hash
        $("#addButton").on("click", () =>
        {
            LoadLink("edit", "add");
        });
    }

    function DisplayEditPage()
    {
        ContactFormValidation();

        let page = router.LinkData;

        switch(page)
        {
            case "add":
                {
                    // edits text/html on page
                    $("main>h1").text("Add Contact");
                    $("#editButton").html(`<i class="fas fa-plus-circle fe-lg"></i> Add`);

                    // adds contact to localStorage
                    $("#editButton").on("click", (event) =>
                    {
                        event.preventDefault();

                        let fullName = document.forms[0].fullName.value as string;
                        let contactNumber = document.forms[0].contactNumber.value as string;
                        let emailAddress = document.forms[0].emailAddress.value as string;

                        AddContact(fullName, contactNumber, emailAddress); // adds contact
                        LoadLink("contact-list");
                    })
                    
                    // redirect to contact-list.html
                    $("#cancelButton").on("click", () =>
                    {
                        LoadLink("contact-list");
                    })
                }
                break;
            default:
                {
                    // creates Contact using deserialized data from localStorage
                    let contact = new core.Contact();
                    contact.deserialize(localStorage.getItem(page) as string);

                    // updates values
                    $("#fullName").val(contact.FullName);
                    $("#contactNumber").val(contact.ContactNumber);
                    $("#emailAddress").val(contact.EmailAddress);

                    $("#editButton").on("click", (event) =>
                    {
                        event.preventDefault();

                        // sets contact data using html values
                        contact.FullName = $("#fullName").val() as string;
                        contact.ContactNumber = $("#contactNumber").val() as string;
                        contact.EmailAddress = $("#emailAddress").val() as string;

                        localStorage.setItem(page, contact.serialize()); // updates record

                        LoadLink("contact-list");
                    });

                    // redirect to contact-list.html
                    $("#cancelButton").on("click", () =>
                    {
                        LoadLink("contact-list");
                    })
                }
                break;
        }
    }

    function CheckLogin()
    {
        // if user is logged in
        if (sessionStorage.getItem("user"))
        {
            // update "login" link to "logout"
            $("#login").html(`<a id="logout" class="nav-link" data="logout"><i class="fas fa-sign-out-alt"></i> Logout</a>`);

            AddNavigationEvents();

            // on remove, clear (user) from session storage and redirect to login page
            $("#logout").on("click", function()
            {
                sessionStorage.clear();

                // swap "logout" link to "login"
                $("#login").html(`<a class="nav-link" data="login"><i class="fas fa-sign-in-alt"></i> Login</a>`);

                AddNavigationEvents();
                
                LoadLink("login");
            });
        }
    }

    function DisplayLoginPage()
    {
        console.log("Login page");

        let messageArea = $("messageArea");
        messageArea.hide();

        AddLinkEvents("register");

        $("#loginButton").on("click", function()
        {
            // set success to false by default and create new empty User object
            let success = false;
            let newUser = new core.User();

            let username = document.forms[0].username.value as string;
            let password = document.forms[0].password.value as string;

            // get data from JSON file
            $.get("./Data/users.json", function(data)
            {
                // for each user in data
                for (const user of data.users)
                {
                    // if user exists, update newUser, set success to true, and break
                    if (username == user.Username && password == user.Password)
                    {
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }

                // if username and password match, success
                if (success)
                {
                    // add user to session storage
                    sessionStorage.setItem("user", newUser.serialize() as string);
                    messageArea.removeAttr("class").hide();

                    LoadLink("contact-list");
                }
                else
                {
                    // on fail, trigger focus and select on username field and show error message
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("Error: Invalid login credentials").show();
                }
            });
        });

        // on cancel, reset form and redirect to homepage
        $("cancelButton").on("click", function()
        {
            document.forms[0].reset();

            LoadLink("home");
        });
    }

    function DisplayRegisterPage()
    {
        console.log("Register page");
        AddLinkEvents("login");
    }

    function Display404()
    {

    }

    /**
     * Reteurns corresponding callback function
     * @returns {function}
     */
    function ActiveLinkCalLBack(): Function
    {
        switch(router.ActiveLink)
        {
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

    // named function
    function Start()
    {
        console.log("App Started!");

        LoadHeader();

        LoadLink("home");

        LoadFooter();
    }

    // adds Start function as event listener to Load event
    window.addEventListener("load", Start);

})();

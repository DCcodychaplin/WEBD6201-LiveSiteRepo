(function(core)
{
    class User
    {
        constructor(displayName = "", emailAddress = "", username = "", password = "")
        {
            this.DisplayName = displayName;
            this.EmailAddress = emailAddress;
            this.Username = username;
            this.Password = password;
        }

        toString()
        {
            return `Display Name: ${this.DisplayName}\nEmail Adress: ${this.EmailAddress}\nUsername: ${this.Username}`;
        }

        toJSON()
        {
            return {
                "DisplayName": this.DisplayName,
                "EmailAddress": this.EmailAddress,
                "Username": this.Username
            }
        }

        fromJSON(data)
        {
            this.DisplayName = data.DisplayName;
            this.EmailAddress = data.EmailAddress;
            this.Username = data.Username;
            this.Password = data.Password;
        }

        serialize()
        {
            // if data is not empty, return data in CSV format
            if (this.DisplayName !== "" && this.EmailAddress !== "" && this.Username !== "")
            {
                return `${this.DisplayName},${this.EmailAddress},${this.Username}`;
            }

            console.error("One or more properties of the user are missing or invalid");
            return null;
        }

        deserialize(data) // assume data in in CSV format
        {
            // parameterized data is split into array and used to set properties
            let propertyArray = data.split(",");
            this.DisplayName = propertyArray[0];
            this.EmailAddress = propertyArray[1];
            this.Username = propertyArray[2];
        }
    }

    core.User = User;
})(core || (core={}));
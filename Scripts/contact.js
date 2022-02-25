(function(core)
{
    class Contact
    {
        // getters and setters
        get FullName()
        {
            return this.m_fullName;
        }

        set FullName(full_name)
        {
            this.m_fullName = full_name;
        }

        get ContactNumber()
        {
            return this.m_contactName;
        }

        set ContactNumber(contact_number)
        {
            this.m_contactName = contact_number;
        }

        get EmailAddress()
        {
            return this.m_emailAddress;
        }

        set EmailAddress(email_address)
        {
            this.m_emailAddress = email_address;
        }

        // constructor
        constructor(fullName = "", contactNumber = "", emailAddress = "")
        {
            this.FullName = fullName;
            this.ContactNumber = contactNumber;
            this.EmailAddress = emailAddress;
        }

        // public utility methods
        serialize()
        {
            // if data is not empty, return data in CSV format
            if (this.fullName !== "" && this.contactNumber !== "" && emailAddress !== "")
            {
                return `${this.FullName},${this.ContactNumber},${this.EmailAddress}`;
            }

            console.error("One or more properties of the contact are missing or invalid");
            return null;
        }

        deserialize(data) // assume data in in CSV format
        {
            // parameterized data is split into array and used to set properties
            let propertyArray = data.split(",");
            this.FullName = propertyArray[0];
            this.ContactNumber = propertyArray[1];
            this.EmailAddress = propertyArray[2];
        }

        // overridden method
        toString()
        {
            return `Full Name: ${this.FullName}\nContact Number: ${this.ContactNumber}\nEmail Address: ${this.EmailAddress}`;
        }
    }

    core.Contact = Contact;
})(core || (core = {}));
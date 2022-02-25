(function(core)
{
    class Router
    {
        // getter
        get ActiveLink()
        {
            return this.m_activeLink;
        }

        // setter
        set ActiveLink(link)
        {
            this.m_activeLink = link;
        }

        /**
         * Creates an instance of Router.
         * @constructor
         */
        constructor()
        {
            this.ActiveLink = "";
        }

        /**
         * Replaces current routing table with new one.
         * Routes should begin with '/' character.
         *
         * @param {String[]} routingTable
         */
        AddTable(routingTable)
        {
            this.m_routingTable = routingTable;
        }

        /**
         * Adds a new route to routing table.
         *
         * @param {string} route
         */
        Add(route)
        {
            this.m_routingTable.push(route);
        }        

        /**
         * Finds index of route in routing table,
         * otherwise returns -1 if not found.
         *
         * @param {string} route
         * @return {number} 
         */
        Find(route)
        {
            return this.m_routingTable.indexOf(route);
        }

        /**
         * Removes route from routing table.
         * Returns true if route is removed, otherwise false.
         *
         * @param {string} route
         * @returns {boolean}
         */
        Remove(route)
        {
            if (this.Find(route) > -1)
            {
                this.m_routingTable.splice(this.Find(route), 1);
                return true;
            }

            return false;
        }

        /**
         * Overrides toString(), returns routing table as string.
         * @override
         * @return {string} 
         */
        toString()
        {
            return this.m_routingTable.toString();
        }
    }

    core.Router = Router;

})(core || (core = {}));

let router = new core.Router();
router.AddTable([
    "#/",
    "#/home",
    "#/about",
    "#/services",
    "#/contact",
    "#/contact-list",
    "#/projects",
    "#/register",
    "#/login",
    "#/edit"
]);

let route = location.pathname; // alias for location.pathname

if (router.Find(route) > -1)
{
    router.ActiveLink = (route == "/") ? "home" : route.substring(1);
}
else
{
    router.ActiveLink = "404"; // file not found
}
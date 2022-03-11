namespace core
{
    export class Router
    {
        private m_activeLink: string;
        private m_linkData: string;
        private m_routingTable: string[];

        // getter
        get ActiveLink(): string
        {
            return this.m_activeLink;
        }

        // setter
        set ActiveLink(link: string)
        {
            this.m_activeLink = link;
        }

        get LinkData(): string
        {
            return this.m_linkData;
        }

        set LinkData(data: string)
        {
            this.m_linkData = data;
        }
        
        /**
         * Creates an instance of Router.
         * @constructor
         */
        constructor()
        {
            this.m_activeLink = "";
            this.m_linkData = "";
            this.m_routingTable = [];
        }

        /**
         * Replaces current routing table with new one.
         * Routes should begin with '/' character.
         *
         * @param {String[]} routingTable
         */
        AddTable(routingTable: string[]): void
        {
            this.m_routingTable = routingTable;
        }

        /**
         * Adds a new route to routing table.
         *
         * @param {string} route
         */
        Add(route: string): void
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
        Find(route: string): number
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
        Remove(route: string): boolean
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
        toString(): string
        {
            return this.m_routingTable.toString();
        }
    }
}

let router: core.Router = new core.Router();
router.AddTable([
    "/",
    "/home",
    "/about",
    "/services",
    "/contact",
    "/contact-list",
    "/projects",
    "/register",
    "/login",
    "/edit"
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
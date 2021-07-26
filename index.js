const chokidar = require('chokidar')

const ox = {
    _add(fn) {
        const blueprint = (options = {}) => {

            // Defaults for every task
            const defaults = {
                watch: false,
                log: true,
                perf: true
            }

            // Assign defaults if they don't exist
            for(const [key, value] of Object.entries(defaults)) {
                if(options[key] === undefined) {
                    options[key] = value
                } 
            }

            // Destructor for convenience
            const { name, perf, log, watch } = options

            // Start performance
            const t0 = performance.now()

            // Set title based on function name or name passed
            const title = !(name || fn.name) ? 'automatic' : `${ name || fn.name}`

            // Let user know we're getting things started
            log ? this._log(`Starting ${ title } task`) : null

            // Give tasks access to underscore functions
            Object.getOwnPropertyNames(this).forEach(prop => {
                if(typeof this[prop] === 'function' && prop[0] === '_') {
                    options[prop] = this[prop]
                }
            })

            // Call the task and pass the decorated options 
            fn(options)

            // Calculate time taken to complete task
            const t1 = performance.now()
            perf ? this._log(`Task took: ${Math.round(t1 - t0)}ms`) : null

            // Watch the task if the option was set
            watch ? this._watch(watch, fn, options) : null

            return this
        }

        // If the function name exists we assign it to the ox object so it can be called
        if(fn.name) {
            this[fn.name] = blueprint 
        } else {
            // If not we just run it.
            this._log(`Function name doesn't exist, running it immediately.`)
            blueprint({ log: true, perf: true })
        }

        return this
    },
    _log(value) {
        console.log(value)
        return this
    },
    _watch(watched, fn, options) {
        let path = '.'
        let events = ['change']

        if(watched.path) {
            path = watched.path
        }

        if(watched.events) {
            events = watched.events
        }

        const watcher = chokidar.watch(path)

        events.forEach(event => {
            watcher.on(event, end => {
                this._log(`${end} was ${event}ed.`)
                fn(options)
            })
        })

        return this
    }
}

module.exports = ox
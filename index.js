const chokidar = require('chokidar')

const ox = {
    _add(fn) {
        const blueprint = (options = {}) => {
            const { name, perf, log, watch } = options

            const t0 = performance.now()
            const title = !(name || fn.name) ? 'automatic' : `${ name || fn.name}`
            log ? this._log(`Starting ${ title } task`) : null

            // Give underscore functions to other tasks
            Object.getOwnPropertyNames(this).forEach(prop => {
                if(typeof this[prop] === 'function' && prop[0] === '_') {
                    options[prop] = this[prop]
                }
            })

            fn(options)

            const t1 = performance.now()
            perf ? this._log(`Task took: ${Math.round(t1 - t0)}ms`) : null

            watch ? this._watch(watch, fn, options) : null

            return this
        }

        if(fn.name) {
            this[fn.name] = blueprint 
        } else {
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

        console.log(events)
        events.forEach(event => {
            watcher.on(event, end => {
                this._log(`${end} was ${event}ed.`)
                fn(options)
            })
        })
        // chokidar.watch(watched)
        //     .on('change', (path) => {
        //         this._log(`${path} was changed.`)
        //         fn(options)
        //     })
    }
}

module.exports = ox
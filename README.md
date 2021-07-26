
# ox

> This is alpha software and it's api will likely change a lot before version one. Use at your own risk.

## A chainable task runner

Ox provides a simple developer facing chainable api with build in logging and file watching.

### Register your task so it can be used by ox.

Ox's <code lang="js">_add</code> function accepts any function as an argument.

The passed function will be decorated, then added to ox's properties list so it can be called as a method via ox.

The function will be accessible via it's function name, if the function has no name ( anonymous function ) it will be executed immediately.

Ox also passes it's whole api to your function so you can take advantage of the built in methods like <code lang="js">_log</code>
```js
ox._add(task)
ox.task()
```

### The Logger

Ox's logger provides a uniform way for tasks to pass messages to the console from one place. The intent is to capture all output and normalize it so it's easier to consume, probably with colors and filesizes. Logging should be provided in your task at important events, for example when a file is created, updated, deleted ect... As mentioned above the <code lang="js">_log</code> function is available to use in your task when it's registered.

```js
function task(arguments) {
    arguments._log('Hello world')
}

ox.add(task)
.task()

// Hello world
```

### The Watcher

Under the hood we are using <code lang="js">chokidar</code> to watch files.

A watcher is provided because some tools don't provide one and it's nice to have a uniform way of capturing events related to filesystem changes.

### The Anatomy of a Task 

Tasks are functions consumed and wrapped by ox's own <code lang="js">_add</code> method.


> Ox tasks take a single object as configuration.


This object contains configuration for ox's built in methods like <code lang="js">_log</code> and <code lang="js">_watch</code>.
It should also contain the configuration of your task.

```js
ox.task({
    log: true,          // <-- This lets ox know if it should show logs via _log
    watch: true,        // <-- This lets ox know if it should use _watch
    options: {          // <-- These options are suppose to be used in your task
        value: 'World'
    } 
})
```

Tasks should be named and exported using <code>module.exports</code>

All of the below methods will result in a task exporting with the name 'task'.
```js
module.exports = function task() {}
module.exports = const task = function() {}
module.exports = const task = () => {}
```

Passing arguments to your task.
The options that are passed to your task are decorated with ox's methods so you can use them.

```js
module.exports = function task(ox) {
    // console.log(ox)
    // {
    //     _add: () => {}              // <-- You can add tasks in tasks! 
    //     _log: () => {}              // <-- A log method to use where needed!
    //     _watch: () => {}            // <-- Probably don't use this unless you know what you're doing.
    //     options: { value: 'World' } // <-- Your options were passed through!
    // }
    ox._log(`Hello ${ox.options.value}`)
}
```

```js
ox._add(task)
.task()
// Hello world
```
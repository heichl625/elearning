const { hooks } = use('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
    const Env = use('Env')
    const View = use('View')

    View.global('BASE_URL', function () {
        return Env.get('BASE_URL')
    })
})
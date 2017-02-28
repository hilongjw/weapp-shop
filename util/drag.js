function move (array, oldIndex, newIndex) {
    if (newIndex >= array.length) newIndex = array.length - 1
    if (newIndex < 0) newIndex = 0
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0])
    return array
}

module.exports = function (app, listName, allowedX) {
    app.drag = {
        inited: false,
        pointer: {
            x: 0,
            y: 0
        },
        end: {
            x: 0,
            y: 0
        },
        start: {
            index: 0,
            x: 0,
            y: 0
        }
    }

    app.dragStart = function (e) {
        const index = e.currentTarget.dataset.index
        const list = this.data[listName]

        this.drag.start.index = index

        this.drag.end.x = e.touches[0].clientX
        this.drag.end.y = e.touches[0].clientY

        this.drag.pointer.x = e.touches[0].clientX
        this.drag.pointer.y = e.touches[0].clientY
        
        list.forEach(item => {
            item.drag = {
                dragging: false,
                x: 0,
                y: 0,
            }
        })

        list[index].drag.dragging = true
        
        // if (allowedX) {
        //     list[index].drag.x = this.drag.start.x
        // }
        // list[index].drag.y = this.drag.start.y

        this.setData({
            [listName]: list
        })
    }

    app.dragMoving = function (e) {
        const index = this.drag.start.index
        const list = this.data[listName]
        const item = list[index].drag

        this.drag.end.x = e.touches[0].clientX
        this.drag.end.y = e.touches[0].clientY

        if (allowedX) {
            item.x = this.drag.end.x - this.drag.pointer.x
        }
        item.y = this.drag.end.y - this.drag.pointer.y

        this.setData({
            [listName]: list
        })
    }

    app.dragCancel = function () {
        let list = this.data[listName]
        list.forEach(item => {
            item.drag = {
                dragging: false,
                x: 0,
                y: 0,
            }
        })
        this.setData({
            [listName]: list
        })
    }

    app.dragEnd = function () {
        const index = this.drag.start.index
        const list = this.data[listName]
        const item = list[index]

        const height = 50

        const upper = this.drag.end.y - this.drag.pointer.y

        const upIndex = Math.round(upper / height)

        this.dragCancel()

        move(list, index, index + upIndex)
        this.setData({
            [listName]: list
        })
        if (this.dragHookEnd) {
            this.dragHookEnd(item, list)
        }
    }
}
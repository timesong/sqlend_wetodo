//index.js
//获取应用实例
var app = getApp()
const util = require('../../utils/util')
const sqlend = require('../../utils/sqlend')

Page({
  data: {
    todos: [],
    editedTodo: {},
    draft: '',
    editDraft: null,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReady: function() {
    // console.log(app.globalData.userInfo)
  },
  onPullDownRefresh: function () {
    this.fetchTodos(app.globalData.userInfo)
  },
  setTodos: function (todos) {
    const activeTodos = todos.filter(todo => !todo.done);
    this.setData({
      todos,
      activeTodos,
    });
  },
  updateDraft: function ({
    detail: {
      value
    }
  }) {
    if (!value) return;
    this.setData({
      draft: value
    });
  },
  addTodo: function () {
    var value = this.data.draft && this.data.draft.trim()
    if (!value) {
      return;
    }

    var todo = {
      content: value,
      done:null,
      created: util.formatTime(new Date()),
      openid:app.globalData.userInfo.openid
    }

    var that = this
    sqlend.request('todos/', 'POST', JSON.stringify(todo), function(res) {
      if (res.data.ok) {
        todo.id = res.data.data
        that.setTodos([todo, ...that.data.todos])
        that.setData({
          draft: ''
        })
      }
    })
  },
  toggleDone: function ({
    target: {
      dataset: {
        id
      }
    }
  }) {
    const { todos } = this.data;
    // console.debug(todos)
    // console.debug(id)
    id = parseInt(id)
    const currentTodo = todos.filter(todo => todo.id === id)[0];
    // console.debug(JSON.stringify(currentTodo))
    var that = this
    var data = 'action=' + (currentTodo.done ? 'pending': 'done')
    sqlend.request('todos/update/' + id, 'POST', data, function(res) {
      if (res.data.ok) {
        currentTodo.done = res.data.data;
        that.setTodos(todos)
      }
    })
  },
  editTodo: function ({
    target: {
      dataset: {
        id
      }
    }
  }) {
    var currentTodo = this.data.todos.filter(todo => todo.id === parseInt(id))[0] || {}
    // console.debug(currentTodo) 
    this.setData({
      editDraft: null,
      editedTodo: currentTodo
    });
  },
  updateEditedContent: function ({
    detail: {
      value
    }
  }) {
    this.setData({
      editDraft: value
    });
  },
  doneEdit: function ({
    target: {
      dataset: {
        id
      }
    }
  }) {
    const { todos, editDraft } = this.data;
    // console.debug("todos", todos)
    // console.debug("editDraft", editDraft)
    this.setData({
      editedTodo: {},
    });
    if (editDraft === null) return;
    const currentTodo = todos.filter(todo => todo.id === parseInt(id))[0];
    if (editDraft === currentTodo.content) return;
    currentTodo.content = editDraft;

    var that = this
    var data = 'action=edit&content=' + editDraft
    sqlend.request('todos/update/' + id, 'POST', data, function(res) {
      if (res.data.ok) {
        that.setTodos(todos);
      }
    })
  },
  removeDone: function () {
    var that = this
    var url = 'todos/remove-done/' + app.globalData.userInfo.openid
    sqlend.request(url, 'DELETE', null, function(res) {
      if (res.data.ok) {
        that.setTodos(res.data.data);
      }
    })
  },
  fetchTodos: function(res) {
    console.debug("loadTodos", res)
    var that = this
    sqlend.request('todos/' + res.openid, 'GET', null, function(res) {
      console.debug(res)
      that.setTodos(res.data.data)
    })
  },
  onLoad: function () {
    console.log('onLoad')
    //调用应用实例的方法获取全局数据
    app.getUserInfo(this.fetchTodos)
  }
})

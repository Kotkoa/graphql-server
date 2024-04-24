//getting username and roomname
//ignore question mark, and give us query parameters as object
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})
console.log(username)
console.log(room)
//const moment = require ('moment')
//getting templates what msg we have to render
const socket = io(`${window.location.protocol}//${window.location.host}`, {
  path: `/${window.location.pathname.split('/')[1]}/socket.io`,
})
socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error)
    location.href = `${window.location.protocol}//${window.location.host}/${
      window.location.pathname.split('/')[1]
    }/`
  }
  console.log('successfuly joined!')
})
//getting template where i have to render msg
const render_msg = document.querySelector('#render-message')

const autoscroll = () => {
  //grab last element
  const $newmessage = render_msg.lastElementChild

  //Height of new message
  var newmessageheight = $newmessage.offsetHeight //It doesnot include margings
  //Get margins height of new element
  const newmessagestyles = getComputedStyle($newmessage) //It returns height of all styles applied
  const newmessagemargin = parseInt(newmessagestyles.marginBottom)
  newmessageheight += newmessagemargin //Final height of new message

  //Find visible height (excluding margings, padding etc) (fixed)
  const visibleheight = render_msg.offsetHeight

  //Height of messages container
  const containerheight = render_msg.scrollHeight

  //Total length scrolled till now
  const totalScrolled = render_msg.scrollTop + visibleheight

  if (containerheight - newmessageheight <= totalScrolled) {
    render_msg.scrollTop = render_msg.scrollHeight
  }
}

socket.on('Message', (data) => {
  console.log(data)
  //create msg
  const msg = Mustache.render(
    "<div class='message'> <p> <span class='message__name'>{{username}}</span> <span class='message__meta'>{{Date}}</span></p> <p>{{my_msg}} </p> </div>",
    {
      username: data.username,
      my_msg: data.text,
      Date: moment(data.time).format('h:mm a'),
      //Date : data.time
    }
  )
  console.log(msg)
  //render msg in div
  render_msg.insertAdjacentHTML('beforeend', msg)
  autoscroll()
})

const form = document.querySelector('#message-form')
const submit_form = document.querySelector('#msg')
//disable form until it is submitted
//disable when event called
//enable when acknowledment received
form.addEventListener('submit', (event) => {
  event.preventDefault()
  const msg = event.target.elements.inp.value.toString()
  if (msg.length) {
    //disable
    submit_form.setAttribute('disabled', 'disabled')
    socket.emit('Send', msg, (error) => {
      //enable
      submit_form.removeAttribute('disabled')
      event.target.elements.inp.value = ''
      event.target.elements.inp.focus() //Bring cursor back to input place
      if (error) console.log(error)
      else console.log('Message Delivered!!')
    })
  }
})

const button = document.querySelector('#location-share')

//https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API (Using MDN Geolocation service)
//navigator.geolocation asks for browser share permission.
//If browser support geolocation proceed
button.addEventListener('click', (event) => {
  if (!navigator.geolocation) {
    return alert('geolocation is Not Supported By Your Browser')
  }
  button.setAttribute('disabled', 'disabled')
  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    socket.emit(
      'SendLocation',
      {
        latitude,
        longitude,
      },
      (error) => {
        button.removeAttribute('disabled')
        if (error) console.log(error)
        else console.log('Location Shared!!')
      }
    )
  })
})

socket.on(
  'GetLocation',
  (data) => {
    const msg = Mustache.render(
      "<div class='message'><p> <span class='message__name'>{{username}}</span> <span class='message__meta'>{{createdAt}}</span></p><p><a href='{{my_msg}}' target='_blank'> Location </a> </p> </div>",
      {
        username: data.username,
        my_msg: data.url,
        createdAt: moment(data.createdAt).format('h:mm a'),
      }
    )
    console.log(msg)
    //render msg in div
    render_msg.insertAdjacentHTML('beforeend', msg)
    autoscroll()
  },
  (error) => {
    if (error) console.log(error)
  }
)

socket.on('RoomData', ({ room, users }) => {
  //to grab from html : seletctbt Id().innerHTML()
  const template =
    "<h2 class='room-title'> Room: {{room}} </h2> <h3 class='list-title'> Users </h3>"
  const template_user =
    "<ul class=users'> {{#users}} <li> {{username}}</li> {{/users}}</ul>"
  const lst = Mustache.render(template, {
    room,
  })
  const lst_user = Mustache.render(template_user, {
    users,
  })
  const sidebar = document.querySelector('#sidebar')
  sidebar.innerHTML = lst
  sidebar.insertAdjacentHTML('beforeend', lst_user)
})

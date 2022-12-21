
const KEY = ''

// ###### links para os assets ########
const apiCountryURL = "https://countryflagsapi.com/png/";
const apiUnsplash = "https://source.unsplash.com/1600x900/?";


const icon_weather = document.querySelector('#weather-icon')
const city = document.querySelector('#city')
const degrees = document.querySelector('#degrees')
const weather_description = document.querySelector('#weather-description')
const weather_speed = document.querySelector('#weather-speed')
const country_flag = document.querySelector('#country-flag')
const humidity = document.querySelector('#humidity')

const form = document.querySelector('form')
const search = document.querySelector('#search-city')

const history_list = document.querySelector('.suggestions-list')



const setCity =(obj)=>{

    icon_weather.setAttribute('src',`http://openweathermap.org/img/wn/${obj.weather[0].icon}.png`)
    country_flag.setAttribute('src', `https://countryflagsapi.com/png/${obj.sys.country}`);

    degrees.innerHTML = obj.main['temp'].toFixed(0) + ' &deg;C'
    weather_description.innerText = obj.weather[0].description;
    city.innerText = obj.name;
    humidity.innerText = obj.main['humidity'] + '%';
    weather_speed.innerText = obj.wind['speed'] + ' km / h '
    
    search.value = "";
}

const createListitem = (arg)=>{
    let list = document.querySelector('.suggestions-list')
    
    let li = document.createElement('li')
    li.setAttribute('class','suggest-city')
    li.innerHTML = `<span>${arg}</span><button><i class="fa-solid fa-magnifying-glass"></i></button>`

    list.appendChild(li)  
}

// ##### lidando com Toggle visual ###############################3###########

const ToggleLoad = ()=>{
    const load = document.querySelector('.load')
    const main = document.querySelector('.main')
    main.classList.toggle('active')
    load.classList.toggle('active')

    setTimeout(()=>{
        main.classList.toggle('active')
        load.classList.toggle('active')
    },2000)
}

const message_error = ()=>{
    let message = document.querySelector('.message-error')
    setTimeout(()=>{
        message.classList.toggle('active')
    },2000)
    message.classList.toggle('active')
}

// ##### função de inicializaçao ########3###3##3##########################

const handledata = async(city)=>{
    try{

        if(!city){
            const  resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=fortaleza&units=metric&appid=${KEY}&lang=pt_br`)
            const data = await resp.json();
            setCity(data)
            console.log(data)
        }else{
            const  resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${KEY}&lang=pt_br`)
            const data = await resp.json();

            if(data.message){
                message_error()
                return
            }

            ToggleLoad()
            setCity(data)
        } 
    }catch(e){
        console.log('error',e)
    }
}

// ##### localStorage functions ########################3###################

const setHist = ()=>{
    let array = JSON.parse(localStorage.getItem('historico'))
    array.forEach(item=>createListitem(item))
}

const handleDatahis = (arg)=>{
    if(!arg) return

    let array = JSON.parse(localStorage.getItem('historico')) || []

    array.length === 5 ? array.shift() : null;
    array.push(arg)
    localStorage.setItem('historico', JSON.stringify(array))
}

// ########  funçoes DOM ##############3#######3###33############3##

form.addEventListener('submit',(e)=>{
    e.preventDefault();

    let query = search.value;
    handleDatahis(query)
    handledata(query);
    
})

history_list.addEventListener('click',(e)=>{
    let city = e.target.innerText;
    handledata(city)
    
    let list = document.querySelectorAll('.suggest-city')
    list.forEach(item => item.style.display = 'none')
})

search.addEventListener('keyup',(e)=>{
    let query = e.target.value;
    
    let cities = document.querySelectorAll('.suggest-city')

    cities.forEach(city=>{
        let city_name = city.innerText;
        city_name.includes(query) ? city.style.display = 'flex' : city.style.display = 'none';
        
        !query ? city.style.display = 'none' : null;
    })
    
})

// ######### inicialização #############################3#########3#############

handledata()
setHist()







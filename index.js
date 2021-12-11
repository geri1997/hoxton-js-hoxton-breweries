const state={
    selectedStateBreweries:[],
    selectedState: null,
    selectedCities:[],
    selectedBreweryType:null,
    breweryTypes:['micro','regional','brewpub'],
    maxNumberOfBreweriesToDisplay:10,
    arrayWithSearchTerm:[],
    page: 1
}

const mainTag = document.querySelector('main')
const selectStateForm = document.querySelector('#select-state-form')
const selectStateInput = document.querySelector('#select-state')
let pageNr = document.querySelector('#pageNr')


selectStateForm.addEventListener('submit',(e)=>{
    state.selectedBreweryType =null
    state.selectedCities = []
    pageNr.textContent = state.page
    e.preventDefault()
    state.selectedState = selectStateInput.value
    mainTag.innerHTML = ''
    const sectionAside = document.createElement('aside')
    sectionAside.setAttribute('class','filters-section')
    const filterByH2 = document.createElement('h2') 
    filterByH2.textContent = 'Filter by:'
    const filterForm = document.createElement('form') 
    filterForm.setAttribute('id','filter-by-type-form')
    filterForm.setAttribute('autocomplete','off')
    const typeLabel = document.createElement('label')
    typeLabel.setAttribute('for','filter-by-type')
    const typeH3 = document.createElement('h3')
    typeH3.textContent = 'Type of Brewery'
    const filterSelect = document.createElement('select') 
    filterSelect.setAttribute('name','filter-by-type')
    filterSelect.setAttribute('id','filter-by-type')
    filterSelect.addEventListener('change',()=>{
        state.selectedBreweryType = filterSelect.value
        state.page = 1
        breweryListUl.innerHTML = ''
        if(!state.selectedBreweryType){
            
            for(let brewery of returnSingleTypeBreweries()){
                createBreweryCard(brewery,breweryListUl)
            }
            renderCities()
        }else{
            let singleTypeBreweries = returnSingleTypeBreweries()
        breweryListUl.innerHTML= ''
        for(let brewery of singleTypeBreweries){
            createBreweryCard(brewery,breweryListUl)
        }
        renderCities()}
    })
    const filterTypeOption = document.createElement('option') 
        filterTypeOption.setAttribute('value','')
        filterTypeOption.textContent = 'Select a type'
        filterSelect.append(filterTypeOption)
    for(let type of state.breweryTypes){
        const filterOption = document.createElement('option') 
        filterOption.setAttribute('value',type)
        filterOption.textContent = type
        filterSelect.append(filterOption)
    }
    const filterByCityDiv = document.createElement('div') 
    filterByCityDiv.setAttribute('class','filter-by-city-heading')

    const citiesH3 = document.createElement('h3') 
    citiesH3.textContent = 'Cities'
    const clearAllBtn = document.createElement('button') 
    clearAllBtn.textContent = 'Clear all'
    clearAllBtn.setAttribute('class','clear-all-btn')
    clearAllBtn.addEventListener('click',e=>{
        state.selectedCities=[]
        breweryListUl.innerHTML = ''
        for(let brewery of returnSingleTypeBreweries()){
            createBreweryCard(brewery,breweryListUl)
        }
        renderCities()
    })

    const filterCityForm = document.createElement('form') 
    filterCityForm.setAttribute('id','filter-by-city-form')

    

    const listOfBreweriesH1 = document.createElement('h1')
    listOfBreweriesH1.textContent = 'List Of Breweries'
    const searchHeader = document.createElement('header')
    searchHeader.setAttribute('class','search-bar')
    const searchForm = document.createElement('form')
    searchForm.setAttribute('id','search-breweries-form')
    searchForm.setAttribute('autocomplete','off')
    const searchInputLabel = document.createElement('label')
    searchInputLabel.setAttribute('for','search-breweries')
    const searchH2 = document.createElement('h2')
    searchH2.textContent = 'Search breweries:'
    const searchInput = document.createElement('input')
    searchInput.setAttribute('id','search-breweries')
    searchInput.setAttribute('name','search-breweries')
    searchInput.setAttribute('type','text')
    searchInput.addEventListener('input',e=>{
        let breweryListUl = document.querySelector('.breweries-list')
        breweryListUl.innerHTML = ''
        state.page = 1
        for(let brewery of returnSingleTypeBreweries()){
            createBreweryCard(brewery,breweryListUl)
        }
        renderCities()
    })
    const breweriesArticle = document.createElement('article')
    const breweryListUl = document.createElement('ul')
    breweryListUl.setAttribute('class','breweries-list')
    typeLabel.append(typeH3)

    sectionAside.append(filterByH2,filterForm,filterByCityDiv,filterCityForm)
    
    filterByCityDiv.append(citiesH3,clearAllBtn)
    
    filterForm.append(typeLabel,filterSelect)

    mainTag.append(sectionAside,listOfBreweriesH1,searchHeader,breweriesArticle)

    searchHeader.append(searchForm)

    searchForm.append(searchInputLabel,searchInput)
    searchInputLabel.append(searchH2)
    breweriesArticle.append(breweryListUl)
    
            
getBreweriesByState(state.selectedState).then((arr)=>{
        state.selectedStateBreweries = arr

        renderCities()
        for(let brewery of returnSingleTypeBreweries()){
            createBreweryCard(brewery,breweryListUl)
        }
    })

})

function createCityCheckbox(city){

    let breweryListUl = document.querySelector('.breweries-list')
    let checkboxForm = document.querySelector('#filter-by-city-form')
    const cityInputCheckbox = document.createElement('input') 
    cityInputCheckbox.setAttribute('type','checkbox')
    cityInputCheckbox.setAttribute('name',city)
    cityInputCheckbox.setAttribute('value',city)
    const cityLabel = document.createElement('label')
    cityLabel.setAttribute('for',city)
    cityLabel.textContent = city
    if(state.selectedCities.includes(cityInputCheckbox.value)){
        cityInputCheckbox.checked =true
    }else{
        cityInputCheckbox.checked =false
    }
    cityInputCheckbox.addEventListener('click',()=>{
        state.page = 1
        if(cityInputCheckbox.checked){
            state.selectedCities.push(cityInputCheckbox.value)
            // let singleTypeBreweries = returnSingleTypeBreweries()
            // let filteredBySingleTypeAndCity = singleTypeBreweries.filter(brewery=>{
            //     return state.selectedCities.includes(brewery.city)    
            // })
            breweryListUl.innerHTML=''
            for(let brewery of returnSingleTypeBreweries()){
                createBreweryCard(brewery,breweryListUl)
            }
            renderCities()
        }else{
            state.selectedCities.splice(state.selectedCities.indexOf(cityInputCheckbox.value),1)
            // let singleTypeBreweries = returnSingleTypeBreweries()
            // let filteredBySingleTypeAndCity = singleTypeBreweries.filter(brewery=>{
            //     return state.selectedCities.includes(brewery.city)    
            // })
            // console.log(filteredBySingleTypeAndCity)
            breweryListUl.innerHTML=''
            for(let brewery of returnSingleTypeBreweries()){
                createBreweryCard(brewery,breweryListUl)
            }
            renderCities()
        }
    })
    checkboxForm.append(cityInputCheckbox,cityLabel)
}

function returnFilteredBreweriesByType(){
    let filteredBreweriesByType = state.selectedStateBreweries.filter(brewery=>{
        return state.breweryTypes.includes(brewery.brewery_type)
    })
    return filteredBreweriesByType
}

function returnCities(breweries){
    let cities = breweries.map(brewery=>{
        return brewery.city
    })
    cities = [...new Set(cities)]
    
    return cities.sort()
}

function getBreweriesByState(selectedState){
    return fetch(`https://api.openbrewerydb.org/breweries?by_state=${selectedState.includes(' ')?selectedState.replaceAll(' ','_'):selectedState}&per_page=50`).then((resp=>{
        return resp.json()
    }))
}
function createBreweryCard(brewery,appendTo){

    const singleBreweryLi = document.createElement('li')
    const breweryNameH2 = document.createElement('h2')
    breweryNameH2.textContent = brewery.name
    const breweryTypeDiv = document.createElement('div')
    breweryTypeDiv.textContent = brewery.brewery_type
    breweryTypeDiv.setAttribute('class','type')
    const addressSection = document.createElement('section')
    addressSection.setAttribute('class','address')
    const addressH3 = document.createElement('h3')
    addressH3.textContent = 'Address:'
    const addressStreetP = document.createElement('p')
    addressStreetP.textContent = brewery.street
    const cityZipP = document.createElement('p')
    const cityZipStrong = document.createElement('strong')
    cityZipStrong.textContent = brewery.city + ', ' + brewery.postal_code
    const phoneSection = document.createElement('section')
    phoneSection.setAttribute('class','phone')
    const phoneH3 = document.createElement('h3')
    phoneH3.textContent = 'Phone:'
    const naP = document.createElement('p') 
    naP.textContent = brewery.phone
    const 
    linkSection= document.createElement('section') 
    linkSection.setAttribute('class',"link")

    if(brewery.website_url){
    const linkTag = document.createElement('a') 
    linkTag.textContent = "Visit Website"
    linkTag.setAttribute('href',brewery.website_url)
    linkTag.setAttribute('target','_blank')
    linkSection.append(linkTag)
    }


    appendTo.append(singleBreweryLi)
    singleBreweryLi.append(breweryNameH2,breweryTypeDiv,addressSection,phoneSection,linkSection)
    addressSection.append(addressH3,addressStreetP,cityZipP)
    cityZipP.append(cityZipStrong)
    phoneSection.append(phoneH3,naP)
}
function returnSingleTypeBreweries(){
    let singleTypeBreweries = returnFilteredBreweriesByType().filter(brewery=>{
            if(state.selectedBreweryType){
                return brewery.brewery_type===state.selectedBreweryType
            }else{
                return true
        }
    }
    )

    singleTypeBreweries =  singleTypeBreweries.filter(brewery=>{
        if(state.selectedCities.length ===0){
            return true
        }
        return state.selectedCities.includes(brewery.city)    
    })
    let searchInput = document.querySelector('input#search-breweries')

    singleTypeBreweries = singleTypeBreweries.filter(brewery=>{
        return brewery.name.toLowerCase().includes(searchInput.value.toLowerCase())
    })
    if(singleTypeBreweries.length<state.maxNumberOfBreweriesToDisplay){
        state.page = 1
        pageNr.textContent = state.page

    }
        if(state.page ===1){
            return singleTypeBreweries.slice(0,state.maxNumberOfBreweriesToDisplay)
        }else{
            return singleTypeBreweries.slice(state.maxNumberOfBreweriesToDisplay*(state.page-1),state.maxNumberOfBreweriesToDisplay*state.page)
        }
    
    // if(state.page === 1){
    //     return singleTypeBreweries.slice(0,state.maxNumberOfBreweriesToDisplay)
    // }else if(state.page ===2){
    //     return singleTypeBreweries.slice(state.maxNumberOfBreweriesToDisplay,state.maxNumberOfBreweriesToDisplay*2)
    // }
}

function renderCities(){
    let checkboxForm = document.querySelector('#filter-by-city-form')
    checkboxForm.innerHTML = ''
    let filteredBySingleType = returnFilteredBreweriesByType().filter(brewery=>{
        if(state.selectedBreweryType){
            return brewery.brewery_type===state.selectedBreweryType
        }else{
            return true
    }
}
)
    let cities = returnCities(filteredBySingleType)
        for(let city of cities){
            createCityCheckbox(city)
        }
    }

function pagination(){
    let prevButton = document.querySelector('#previous')
    let nextButton = document.querySelector('#next')
    let pageNr = document.querySelector('#pageNr')



    nextButton.addEventListener('click',e=>{
        let singleTypeBreweries = returnFilteredBreweriesByType().filter(brewery=>{
            if(state.selectedBreweryType){
                return brewery.brewery_type===state.selectedBreweryType
            }else{
                return true
        }
    }
    )
    
    singleTypeBreweries =  singleTypeBreweries.filter(brewery=>{
        if(state.selectedCities.length ===0){
            return true
        }
        return state.selectedCities.includes(brewery.city)    
    })
    let searchInput = document.querySelector('input#search-breweries')
    
    singleTypeBreweries = singleTypeBreweries.filter(brewery=>{
        return brewery.name.toLowerCase().includes(searchInput.value.toLowerCase())
    })
        let maxPages = Math.ceil(singleTypeBreweries.length/state.maxNumberOfBreweriesToDisplay)
        if(state.page===maxPages){
            return 1
        }
        if(state.page<maxPages){state.page++}
        pageNr.textContent = state.page
        
        
        let breweryListUl = document.querySelector('.breweries-list')
        breweryListUl.innerHTML = ''
        for(let brewery of returnSingleTypeBreweries()){
                    createBreweryCard(brewery,breweryListUl)
                }
                renderCities()
    })
    prevButton.addEventListener('click',e=>{
        let singleTypeBreweries = returnFilteredBreweriesByType().filter(brewery=>{
            if(state.selectedBreweryType){
                return brewery.brewery_type===state.selectedBreweryType
            }else{
                return true
        }
    }
    )
    
    singleTypeBreweries =  singleTypeBreweries.filter(brewery=>{
        if(state.selectedCities.length ===0){
            return true
        }
        return state.selectedCities.includes(brewery.city)    
    })
    let searchInput = document.querySelector('input#search-breweries')
    
    singleTypeBreweries = singleTypeBreweries.filter(brewery=>{
        return brewery.name.toLowerCase().includes(searchInput.value.toLowerCase())
    })
        let maxPages = Math.ceil(singleTypeBreweries.length/state.maxNumberOfBreweriesToDisplay)
        if(state.page===1){
            return 1
        }
        if(state.page>1){state.page--}
        pageNr.textContent = state.page
        let breweryListUl = document.querySelector('.breweries-list')
        breweryListUl.innerHTML = ''
        for(let brewery of returnSingleTypeBreweries()){
                    createBreweryCard(brewery,breweryListUl)
                }
                renderCities()
                
            })
}
pagination()
ymaps.ready(initMap);

let myMap;

function initMap() {
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 10,
        controls: ['zoomControl']
    }, {suppressMapOpenBlock: true});

    myMap.behaviors.disable('scrollZoom');
    myMap.behaviors.disable('drag');
    myMap.behaviors.disable('multiTouch');

    let position = myMap.getGlobalPixelCenter();
    myMap.setGlobalPixelCenter([position[0] - 400, position[1]]);
}


const detailsBtn = document.querySelector('.details-btn'),
    details = document.querySelector('.details'),
    addressBtn = document.querySelector('.form__address-btn'),
    inputToWhere = document.querySelector('.form__input-wrapper_to');


detailsBtn && detailsBtn.addEventListener('click', e => {
    e.preventDefault();
    details.classList.toggle('details_active');
    myMap.container.fitToViewport();
});


addressBtn && addressBtn.addEventListener('click', e => {
    e.preventDefault();
    inputToWhere.classList.toggle('form__input-wrapper_to_active');
    addressBtn.parentNode.removeChild(addressBtn);
    myMap.container.fitToViewport();
});


const selectItems = [].slice.call(document.getElementsByClassName('form__select-item'));

selectItems.forEach((element, index) => {
    element.addEventListener('mouseover', e => {
        let input = document.activeElement;
        input.value = e.currentTarget.querySelector('p').innerHTML;
    });
});


const ambulances = [].slice.call(document.getElementsByClassName('form__ambulance'));


ambulances.forEach((element, index) => {
    element.addEventListener('click', e => {
        e.currentTarget.classList.add('form__ambulance_active');
        for (let ambulance of ambulances) {
            if (ambulance !== e.currentTarget) {
                ambulance.classList.remove('form__ambulance_active');
            }
        }
    });
});


/// FORM

const errorValidTel = 'Номер телефона не валидный',
    successMessage = 'Ваша заявка отправлена',
    telPattern = /^[\+|\d][\d\(\)\-\s]{7,50}$/i;

const indexForm = document.querySelector('#form');


indexForm && indexForm.addEventListener('submit', formListener);

function formListener(e) {
    e.preventDefault();

    let form = e.target;
    let tel = form.querySelector('[name="tel"]').value;
    let fromWhere = form.querySelector('[name="fromWhere"]').value;
    let toWhere = form.querySelector('[name="toWhere"]').value;
    let name = form.querySelector('[name="name"]').value;
    let age = form.querySelector('[name="age"]').value;
    let diagnosis = form.querySelector('[name="diagnosis"]').value;
    let treatment = form.querySelector('[name="treatment"]').value;
    let escort = form.querySelector('[name="escort"]').value;
    let comments = form.querySelector('[name="comments"]').value;

    if (!telPattern.test(tel)) {
        alert(errorValidTel);
    } else {
        let data = {tel, fromWhere, toWhere, name, age, diagnosis, treatment, escort, comments};
        fetch('/form/', {
            method: 'POST',
            credentials: "include",
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(data)
        })
            .then(() => {
                alert(successMessage)
            })
            .catch(e => console.log(e))
    }

}
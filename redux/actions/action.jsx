import {LOGIN, ADD_CAR_ALQUILER, LIST_CARS, LIST_CARS_SUCCESS, LIST_CARS_ALQUILADOS, 
    LIST_CARS_ALQUILADOS_SUCCESS, GET_CARS, GET_CARS_SUCCESS, GET_RATING_CARS, GET_RATING_CARS_SUCCESS, LIST_LOCATIONS, 
    LIST_LOCATIONS_SUCCESS, LIST_USERS, LIST_USERS_SUCCESS, EDIT_PROFILE,
    EDIT_PROFILE_SUCCESS, RESERVE, RESERVE_SUCCESS, GET_RESERVA, GET_RESERVA_SUCCESS, RESET_RESERVA, 
    GET_RESERVAS, GET_RESERVAS_SUCCESS, SEND_FEEDBACK, SEND_FEEDBACK_SUCCESS, UPLOAD_USER, UPLOAD_USER_SUCCESS
} from '../constants'

export const addCarAlquiler = (data)=>{
    return {
        type: ADD_CAR_ALQUILER,
        data 
    }
}
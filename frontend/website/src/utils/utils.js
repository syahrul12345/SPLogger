import axios from 'axios';


export const GetAll = (callback) => {
  const baseURL = process.env.REACT_APP_BACKEND_URL
  const url = `${baseURL}/api/getall`
  axios.get(url)
    .then((res) => {
      const { data } = res
      callback(data)
    })
    .catch((err) => {
      console.log(err)
    })
}

export const SubmitDelete = (callback,failCallback,appliance) => {
  const baseURL = process.env.REACT_APP_BACKEND_URL
  const url = `${baseURL}/api/delete`
  axios.delete(url,{
    headers: {
      "Content-Type": "application/json",
    },
    data: appliance,
  })
    .then((res) => {
      callback(res,appliance)
    })
    .catch((err) => {
      failCallback(err.response)
    })
}

export const AddAppliance = (callback,failCallback,appliance) => {
  const baseURL = process.env.REACT_APP_BACKEND_URL
  const url = `${baseURL}/api/add`
  axios.post(url,appliance)
    .then((res) => {
      callback(res)
    })
    .catch((err) => {
      failCallback(err.response)
    })
}

export const EditAppliance = (callback,failCallback,appliance) => {
  const baseURL = process.env.REACT_APP_BACKEND_URL
  const url = `${baseURL}/api/edit`
  axios.post(url,appliance)
    .then((res) => {
      callback(res)
    })
    .catch((err) => {
      failCallback(err.response)
    })
}

export const SubmitSearch = (callback,failcallback,searchFilter,searchTerm) => {
  const baseURL = process.env.REACT_APP_BACKEND_URL
  const url = `${baseURL}/api/search?filter=${searchFilter}&search=${searchTerm}`
  axios.get(url)
    .then((res) => {
      callback(res)
    })
    .catch((err) => {
      failcallback(err.response)
    })
}
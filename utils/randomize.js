import { v4 as uuid } from "uuid"

const randomize = (number) => {
  const scramble = uuid().replace(/-/g,'')
  return `VX${scramble.slice(0, number || 20)}`
};

const changeclass = () => {
  const element = document.querySelectorAll('[class]')
  element.forEach(result => {
    const currentclass = result.className
    const random = randomize(100)
    const newclass = `${random} ${currentclass}`
    result.className = newclass
  })
}

export default changeclass;
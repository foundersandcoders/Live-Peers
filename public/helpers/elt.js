const elt = (type, msg) => {
  const newElt = document.createElement(type);
  newElt.innerHTML = msg;
  return newElt;
};

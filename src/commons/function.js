export function in_array(search, array) {
    for (var i in array) {
      if (array[i] == search) {
        return true;
      }
    }
    return false;
  }
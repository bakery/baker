import Parse from 'parse/react-native';

export function getCurrentUser() {
  return Parse.User.currentAsync().then(currentUser => {
    if (currentUser) {
      return currentUser;
    }
  }, error => error);
}

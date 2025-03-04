export function sortPlayers(a, b) {
  if (parseFloat(a?.player?.shirtNumber) < parseFloat(b?.player?.shirtNumber)) {
    return -1;
  }
  if (parseFloat(a?.player?.shirtNumber) > parseFloat(b?.player?.shirtNumber)) {
    return 1;
  }
  return 0;
}

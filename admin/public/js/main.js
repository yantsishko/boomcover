$(function () {
  $('[data-toggle="popover"]').popover()
  $('[data-toggle="popover"]').on('click', (e) => {
    e.preventDefault();
  })
});
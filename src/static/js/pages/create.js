(function ($) {
  $(function () {
    $("#get-ppoid-early").on("click", function () {
      var isChecked = $.prop($(this)[0], "checked");
      if (
        isChecked === true &&
        confirm(
          "Are you sure?\n\nThis is only to get a PO# so you can log into the store. This cannot be undone!"
        )
      ) {
        $.ajax({
          type: "POST",
          url: "/api/v1/purchase/create/interim/",
        })
          .done(function (data) {
            var pretty_po_id = data.data.pretty_po_id;
            var po_id = data.data.po_id;
            var ppo_id = "- PO #" + pad(pretty_po_id, 4);
            $("#ppoid").html(ppo_id);
            $("#_ppoid").val(ppo_id);
            $("#_poid").val(po_id);
            $("#get-ppoid-early").attr("disabled", true);
          })
          .fail(function () {
            alert(
              "We weren't able to retrieve a new PO number, try again later"
            );
          });
      } else {
        $.prop($(this)[0], "checked", false);
      }
    });

    var submitBtn = document.querySelector("#create-form-submit");
    if (submitBtn) {
      submitBtn.addEventListener("click", function (e) {
        e.target.disabled = true;
        $(this).text("Creating...");
        $(this).parents("form").submit();
      });
    }
  }); // End of $(function () {
})(window.jQuery);

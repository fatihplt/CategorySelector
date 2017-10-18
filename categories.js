//By Fatih Polat 
//07.10.2017 14:30


(function (jQuery) {

				jQuery.fn.loadCategories = function (options) {

								//sayfaya eklenen root div.(Main.js den çağrılıyor)
								var rootDiv = jQuery(this);


								if (options.ControlWidthReferansElement != null)
								{
												var referasnWidth = $('#' + options.ControlWidthReferansElement).width();
												rootDiv.css('width', referasnWidth);
								}

								//Mevcut select controlleri temizle
								ClearCategories();

								var pathItems = null;

								if (options.CategoryPath != null && options.CategoryPath.length > 0)
								{
												pathItems = options.CategoryPath.split('/');

												//ID path gönderildi. Sırayla seçilen kategoriler ayarlanacak.(Set Selectected Categories)
												AddChildCategories(0, pathItems[0], true);
								} else
								{
												pathItems = null;

												//Menüden seçilen kategorinin alt kırılımlarını ekle
												AddChildCategories(0, options.categoryid, true);
								}

								/*
									* Bu method gönderilen kategoriid nin alt kırılımlarını yüklemek için sıraya bir select element i ekler.
									*/
								function AddChildCategories(LastIndex, CategoryId, isRoot)
								{
												//Sayfadaki hidden inputa son seçilen kategoriyi yaz
												$('#' + options.HiddenSelectedIDControl).val(CategoryId);

												// root div deki tüm selectleri al
												var SelectCategoriesControl = $(rootDiv.selector + " :input");

												// Tıklanan selectedn sonraki selectleri sil. Yeniden yüklenecek.
												jQuery.each(SelectCategoriesControl, function (i, val) {

																var crnID = val.id;
																var crnIndex = crnID.split('-')[1];

																if (crnIndex > LastIndex) {
																				$('#cat-' + crnIndex).remove();
																}

												});

												$('#' + options.SelectedCategoriesPathControl).buildcategories({
																SelectedCategoriesPathControl: options.SelectedCategoriesPathControl,
																root_div_selector: rootDiv.selector
												});


												// Tıklanan selectteki kategorinin childlarını yüklemek için yeni selectle ekle
												var $new_select = $("<select class='category-select' id='cat-" + parseInt(parseInt(LastIndex) + parseInt(1)) + "' multiple='multiple'></select>");

												// Yeni eklenen select in eventi atanıyor.
												$new_select.bind("change", function () {
																AddChildCategories
																								(
																																parseInt(parseInt(LastIndex) + parseInt(1)),
																																$("#cat-" + parseInt(parseInt(LastIndex) + parseInt(1)) + " option:selected").val(),
																																false
																																);
												});

												// Select i root div e ekle
												$(rootDiv.selector).append($new_select);

												//auto fit = true ise selectleri div e 3 tane sığacak şekilde ayarla
												if (options.auto_fit)
												{
																var selectWidth = (($(rootDiv.selector).width()) / options.SelectPerScreen) - 0.01;
																//alert("SEL W:" + selectWidth);
																$new_select.css('width', selectWidth);
												}

												//yeni eklenen select
												var childSelect = $("#cat-" + parseInt(parseInt(LastIndex) + parseInt(1)));

												//selectin için kategori childlar ile doldur
												fillCategories(CategoryId, childSelect, isRoot)

												childSelect.hide();
												childSelect.show(100)
								}

								/*
									* Bu method gönderilen category id nin alt kırılımlarını gönderilen select e ekler. Eğer ilk select ise div i görünür yapacak.
									*/
								function fillCategories(CategoryID, ESelect, isRoot)
								{
												//Select in alt kırılımlarını gösteren select leri kaldır
												ESelect.children().remove();

												$.ajax({type: 'POST', url: options.CategoryCallPage, data: {CategoryID: CategoryID}, beforeSend: function () {}, success: function (data) {

																				//data format >>>>>   categoryid-categoryname#categoryid-categoryname#categoryid-categoryname
																				var childs = data.trim();

																				if (childs.length > 0)
																				{
																								$(rootDiv.selector).show();

																								var items = childs.split("#");

																								for (i = 0; i < items.length; i++)
																								{
																												var itemparts = items[i].split("-");

																												//alt kırılımları select e ekle
																												ESelect.append('<option value="' + itemparts[0] + '">' + itemparts[1] + '</option>');
																								}

																								//selectlerin pozisyonlarını ayarla
																								BuildCategorySelectPositons();

																				} else
																				{
																								if (isRoot)
																								{
																												$(rootDiv.selector).hide();
																								}
																								//Eğer kategorinin alt kırılımı yoksa kaldır.
																								ESelect.remove();
																								BuildCategorySelectPositons();
																				}


																				resumeCategoryPathSelected(ESelect);

																},
																error: function () {

																}
												});

								}


								function BuildCategorySelectPositons() {

												//select lerin bazı css leri okunuyor
												var SelectCategoriesControl = $(rootDiv.selector + " :input");

												var divWidth = $(rootDiv.selector).width();

												var divPaddingLeft = $(rootDiv.selector).css('padding-left');

												var divPaddingRight = $(rootDiv.selector).css('padding-right');

												var catWidth = SelectCategoriesControl.outerWidth();

												var divMarginLeft = SelectCategoriesControl.css('margin-left').replace("px", "").replace("PX", "");

												var divMarginRight = SelectCategoriesControl.css('margin-right').replace("px", "").replace("PX", "");

												//alert("DV W : " + divWidth);

												// kategori selectlerinin marginler dahil toplam uzunluğu
												var totalWidth = (catWidth + parseInt(divMarginLeft) + parseInt(divMarginRight)) * SelectCategoriesControl.length;

												//alert("TOT W : " + totalWidth);

												// select lerin rott div den ne kadar uzun olduğunu al
												var difference = (divWidth - totalWidth);

												// Eğer selectler sağa doğru kaybolduysa. Tüm selectleri sola kaydır ve en sağdakini sabitle
												if (difference < 0) {

																if (options.Animate)
																{
																				jQuery.each(SelectCategoriesControl, function (i, val) {
																								$("#" + val.id).animate({left: difference}, 500);
																				});
																} else
																{
																				jQuery.each(SelectCategoriesControl, function (i, val) {
																								$("#" + val.id).css('left', difference);
																				});
																}


												} else {

																if (options.Animate)
																{
																				jQuery.each(SelectCategoriesControl, function (i, val) {
																								$("#" + val.id).animate({left: 0}, 500);
																				});
																} else
																{
																				jQuery.each(SelectCategoriesControl, function (i, val) {
																								$("#" + val.id).css('left', 0);
																				});
																}
												}

								}

								function resumeCategoryPathSelected(SelectControl)
								{
												if (pathItems != null && pathItems.length > 0)																
												{
																var index = SelectControl.selector.split('-')[1];
																SelectControl.val(pathItems[index]).change();
												}

								}

								function ClearCategories()
								{
												//root divdeki tüm selectleri al
												var SelectCategoriesControl = $(rootDiv.selector + " :input");

												// Tıklanan selectedn sonraki selectleri sil
												jQuery.each(SelectCategoriesControl, function (i, val) {

																$('#' + val.id).remove();
												});
								}

				}


				/*
					* Seçilen Kategori Path
					*/

				jQuery.fn.buildcategories = function (options) {

								BuildSelectedPath();

								/*
									* Bu method seçilen kategorilerin pathini oluşturur ve div in altındaki diğer div yazar.
									*/
								function BuildSelectedPath()
								{

												if (options.SelectedCategoriesPathControl != null)
												{
																
																//path in yazılacağı div controlü
																var selectedPathDv = options.SelectedCategoriesPathControl;

																//pathi boşalt
																$("#" + selectedPathDv).empty();

																//Select controllerin bulunduğu div
																var SelectCategoriesControl = $(options.root_div_selector + " :input");

																var CategoryIndex = 1;

																//Seçilmiş kategori selectlerinde dön
																jQuery.each(SelectCategoriesControl, function (i, val) {

																				var catID = $("#" + val.id + " option:selected").val();

																				var catName = $("#" + val.id + " option:selected").text();

																				//pathi göstermek için lable ekle
																				$path_Label = $("<label id='" + catID + "'>" + catName + "</label>");

																				//birinci haricinde path itemlar arasına / koy
																				if (CategoryIndex > 1)
																				{
																								$("#" + selectedPathDv).append(" / ");
																				}

																				//label i ekle
																				$("#" + selectedPathDv).append($path_Label);

																				CategoryIndex++;

																});

												}

								}

				}

				jQuery.fn.setselectedcategory = function (options) {

								//var pathItems = options.CategoryPath.split('/');

								$("#dv_categories").loadCategories({
												CategoryPath: options.CategoryPath,
												categoryid: 0,
												auto_fit: true,
												SelectedCategoriesPathControl: options.SelectedCategoriesPathControl,
												HiddenSelectedIDControl: options.HiddenSelectedIDControl,
												Animate: options.Animate
								});

				}

})(jQuery);









using Omu.AwesomeMvc;
using SimpleDemoAwe.Models;
using System.Linq;
using System.Web.Mvc;

namespace SimpleDemoAwe.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetCategories()
        {
            var items = Db.Categories
                .Select(o => new KeyContent(o.Id, o.Name));

            return Json(items);
        }

        public ActionResult GetMeals(int? parent)
        {
            var items = Db.Meals.Where(o => o.Category.Id == parent)
                .Select(o => new KeyContent(o.Id, o.Name));

            return Json(items);
        }

        public ActionResult GetAllMeals()
        {
            var items = Db.Meals.Select(o => new KeyContent(o.Id, o.Name));

            return Json(items);
        }

        public ActionResult GetMealsAuto(string v)
        {
            v = (v ?? "").ToLower().Trim();
            var items = Db.Meals.Where(o => o.Name.ToLower().Contains(v))
                .Take(5)
                .Select(o => new KeyContent(o.Id, o.Name, false));

            return Json(items);
        }

        public ActionResult GridGetItems(GridParams g)
        {
            var list = Db.Dinners.AsQueryable();

            var gridModel = new GridModelBuilder<Dinner>(list, g)
            {
                Key = "Id", // needed when using EF, nesting, tree, client api
                Map = o => new
                {
                    o.Id,
                    o.Name,
                    Date = o.Date.ToString("dd MMM yyyy"),
                    CountryName = o.Country.Name,
                    ChefName = o.Chef.FirstName + " " + o.Chef.LastName
                } 
            }.Build();

            return Json(gridModel);
        }

        public ActionResult GetMealsAjaxList(string parent, int page)
        {
            const int PageSize = 10;
            parent = parent ?? "";

            var list = Db.Meals.Where(o => o.Name.ToLower().Contains(parent.ToLower())).OrderByDescending(o => o.Id);

            return Json(new AjaxListResult
            {
                Items = list.Skip((page - 1) * PageSize).Take(PageSize).Select(o => new KeyContent(o.Id, o.Name)),
                More = list.Count() > page * PageSize
            });
        }
    }
}
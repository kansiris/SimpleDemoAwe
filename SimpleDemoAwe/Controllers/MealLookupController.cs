using Omu.AwesomeMvc;
using SimpleDemoAwe.Models;

using System.Linq;
using System.Web.Mvc;

namespace SimpleDemoAwe.Controllers
{
    public class MealLookupController : Controller
    {
        public ActionResult GetItem(int? v)
        {
            var o = Db.Meals.SingleOrDefault(f => f.Id == v) ?? new Meal();

            return Json(new KeyContent(o.Id, o.Name));
        }

        public ActionResult Search(string search, int page)
        {
            search = (search ?? "").ToLower().Trim();
            var list = Db.Meals.Where(f => f.Name.ToLower().Contains(search));
            return Json(new AjaxListResult
            {
                Items = list.Skip((page - 1) * 7).Take(7).Select(o => new KeyContent(o.Id, o.Name)),
                More = list.Count() > page * 7
            });
        }
    }
}
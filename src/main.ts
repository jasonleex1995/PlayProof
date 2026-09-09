import "./style.css";
import { startRouter, type Route } from "./router";
import { renderHome } from "./views/home";
import { renderDevHome } from "./views/developer/dashboard";
import { renderDevNew } from "./views/developer/newRequest";
import { renderDevRequest } from "./views/developer/requestDetail";
import { renderDevPosting } from "./views/developer/posting";
import { renderDevReport } from "./views/developer/report";
import { renderTesterRegister } from "./views/tester/register";
import { renderTesterHome } from "./views/tester/board";
import { renderTesterMission } from "./views/tester/mission";
import { renderTesterRewards } from "./views/tester/rewards";
import { renderPostings } from "./views/postings";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");
const root = app;

function render(route: Route): void {
  switch (route.name) {
    case "home":
      renderHome(root);
      break;
    case "postings":
      renderPostings(root);
      break;
    case "dev-home":
      renderDevHome(root);
      break;
    case "dev-new":
      renderDevNew(root);
      break;
    case "dev-request":
      renderDevRequest(root, route.id);
      break;
    case "dev-posting":
      renderDevPosting(root, route.id);
      break;
    case "dev-report":
      renderDevReport(root, route.id);
      break;
    case "tester-register":
      renderTesterRegister(root);
      break;
    case "tester-home":
      renderTesterHome(root);
      break;
    case "tester-mission":
      renderTesterMission(root, route.id);
      break;
    case "tester-rewards":
      renderTesterRewards(root);
      break;
  }
}

startRouter(render);

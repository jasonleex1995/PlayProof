import "./style.css";
import { startRouter, type Route } from "./router";
import { renderLogin } from "./views/login";
import { renderDevHome } from "./views/developer/dashboard";
import { renderDevNew } from "./views/developer/newRequest";
import { renderDevRequest } from "./views/developer/requestDetail";
import { renderDevReport } from "./views/developer/report";
import { renderTesterHome } from "./views/tester/board";
import { renderTesterMission } from "./views/tester/mission";
import { renderTesterRewards } from "./views/tester/rewards";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");
const root = app;

function render(route: Route): void {
  switch (route.name) {
    case "login":
      renderLogin(root);
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
    case "dev-report":
      renderDevReport(root, route.id);
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

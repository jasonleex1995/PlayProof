export type Route =
  | { name: "home" }
  | { name: "dev-home" }
  | { name: "dev-new" }
  | { name: "dev-request"; id: string }
  | { name: "dev-posting"; id: string }
  | { name: "dev-report"; id: string }
  | { name: "tester-register" }
  | { name: "tester-home" }
  | { name: "tester-mission"; id: string }
  | { name: "tester-rewards" };

type Listener = (route: Route) => void;

let current: Route = { name: "home" };
const listeners = new Set<Listener>();

function parseHash(hash: string): Route {
  const raw = hash.replace(/^#\/?/, "");
  const [a, b, c] = raw.split("/");
  if (!a || a === "home" || a === "login") return { name: "home" };
  if (a === "dev" && !b) return { name: "dev-home" };
  if (a === "dev" && b === "new") return { name: "dev-new" };
  if (a === "dev" && b === "request" && c) return { name: "dev-request", id: c };
  if (a === "dev" && b === "posting" && c) return { name: "dev-posting", id: c };
  if (a === "dev" && b === "report" && c) return { name: "dev-report", id: c };
  if (a === "tester" && b === "register") return { name: "tester-register" };
  if (a === "tester" && !b) return { name: "tester-home" };
  if (a === "tester" && b === "mission" && c) return { name: "tester-mission", id: c };
  if (a === "tester" && b === "rewards") return { name: "tester-rewards" };
  return { name: "home" };
}

export function routeToHash(route: Route): string {
  switch (route.name) {
    case "home":
      return "#/";
    case "dev-home":
      return "#/dev";
    case "dev-new":
      return "#/dev/new";
    case "dev-request":
      return `#/dev/request/${route.id}`;
    case "dev-posting":
      return `#/dev/posting/${route.id}`;
    case "dev-report":
      return `#/dev/report/${route.id}`;
    case "tester-register":
      return "#/tester/register";
    case "tester-home":
      return "#/tester";
    case "tester-mission":
      return `#/tester/mission/${route.id}`;
    case "tester-rewards":
      return "#/tester/rewards";
  }
}

export function getRoute(): Route {
  return current;
}

export function navigate(route: Route): void {
  const hash = routeToHash(route);
  if (location.hash !== hash) location.hash = hash;
  else {
    current = route;
    listeners.forEach((l) => l(current));
  }
}

export function startRouter(onChange: Listener): void {
  listeners.add(onChange);
  const sync = () => {
    current = parseHash(location.hash);
    onChange(current);
  };
  window.addEventListener("hashchange", sync);
  if (!location.hash) location.hash = "#/";
  else sync();
}

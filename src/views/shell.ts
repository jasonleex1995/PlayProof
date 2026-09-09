import { navigate, type Route } from "../router";
import { currentUser } from "../data/mock";

export function shell(opts: {
  role: "developer" | "tester";
  active: string;
  body: string;
}): string {
  const user = opts.role === "developer" ? currentUser.developer : currentUser.tester;
  const nav =
    opts.role === "developer"
      ? `
        <a href="#/dev" class="${opts.active === "home" ? "active" : ""}">의뢰 대시보드</a>
        <a href="#/dev/new" class="${opts.active === "new" ? "active" : ""}">새 의뢰</a>
      `
      : `
        <a href="#/tester" class="${opts.active === "home" ? "active" : ""}">미션 보드</a>
        <a href="#/tester/rewards" class="${opts.active === "rewards" ? "active" : ""}">리워드</a>
      `;

  return `
    <div class="app-shell">
      <header class="topbar">
        <a class="brand" href="#/">
          <span class="brand-mark">P</span>
          PlayProof
        </a>
        <nav class="top-nav">${nav}</nav>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <div class="user-chip">
            <span class="avatar">${user.name.slice(0, 1)}</span>
            <span>${opts.role === "developer" ? currentUser.developer.studio : user.name}</span>
          </div>
          <button class="btn btn-ghost" type="button" data-go="home">홈으로</button>
        </div>
      </header>
      <main class="page">${opts.body}</main>
    </div>
  `;
}

export function bindShellActions(root: HTMLElement): void {
  root.querySelector("[data-go='home']")?.addEventListener("click", () => {
    navigate({ name: "home" });
  });
}

export function go(route: Route): void {
  navigate(route);
}

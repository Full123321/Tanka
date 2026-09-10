// ============================================
//   РЕЖИМ "тяночка занята!"
//   1 команда | бесконечное время | админ 971A66BA801843CF
// ============================================

Room.PopUp("✅ Скрипт загружен! Версия 2.0");

var CREATOR_ID = "971A66BA801843CF";

// --- ПОПАПЫ ---
Room.PopupsEnable = true;

// ============================================
//   1. КОМАНДЫ — В САМОМ НАЧАЛЕ
//   (чтобы работали даже если что-то ниже упадёт)
// ============================================

Teams.OnRequestJoinTeam.Add(function(player, team) {
  team.Add(player);
  if (IsAdmin(player)) {
    GiveAdmin(player);
  } else {
    GiveDefault(player);
  }
});

Teams.OnPlayerChangeTeam.Add(function(player) {
  player.Spawns.Spawn();
});

Teams.Add("Blue", "Строители", { r: 50, g: 150, b: 255 });
Teams.Get("Blue").Spawns.SpawnPointsGroups.Add(1);

// ============================================
//   2. БАЗОВАЯ НАСТРОЙКА
// ============================================

Spawns.GetContext().RespawnTime.Value = 0;

Properties.GetContext().GameModeName.Value = "тяночка занята!";
Ui.GetContext().Hint.Value = "тяночка занята! /help — все команды и зоны";

BreackGraph.BreackAll = true;
BreackGraph.OnlyPlayerBlocksDmg = false;
BreackGraph.WeakBlocks = false;

LeaderBoard.PlayerLeaderBoardValues = [
  { Value: "Scores", DisplayName: "Coins", ShortDisplayName: "🪙" },
  { Value: "Kills", DisplayName: "Kills", ShortDisplayName: "K" },
  { Value: "Deaths", DisplayName: "Deaths", ShortDisplayName: "D" },
  { Value: "Spawns", DisplayName: "Spawns", ShortDisplayName: "S" }
];

// ============================================
//   3. ИНВЕНТАРЬ ПО УМОЛЧАНИЮ
// ============================================
var invCtx = Inventory.GetContext();
invCtx.Main.Value = false;
invCtx.Secondary.Value = false;
invCtx.Melee.Value = true;
invCtx.Explosive.Value = false;
invCtx.Build.Value = true;
invCtx.BuildInfinity.Value = true;
invCtx.MainInfinity.Value = false;
invCtx.SecondaryInfinity.Value = false;
invCtx.ExplosiveInfinity.Value = false;

// ============================================
//   4. СТРОИТЕЛЬНЫЕ ИНСТРУМЕНТЫ
//   Подтверждённые — напрямую, остальные — try-catch
// ============================================
var b = Build.GetContext();
b.BuildModeEnable.Value = true;
b.Pipette.Value = true;
b.FloodFill.Value = true;
b.FillQuad.Value = true;
b.RemoveQuad.Value = true;
b.BalkLenChange.Value = true;
b.FlyEnable.Value = true;
try { b.SetSkyEnable.Value = true; } catch(e) {}
try { b.GenMapEnable.Value = true; } catch(e) {}
try { b.ChangeCameraPointsEnable.Value = true; } catch(e) {}
try { b.QuadChangeEnable.Value = true; } catch(e) {}
try { b.CollapseChangeEnable.Value = true; } catch(e) {}
try { b.RenameMapEnable.Value = true; } catch(e) {}
try { b.ChangeMapAuthorsEnable.Value = true; } catch(e) {}
try { b.LoadMapEnable.Value = true; } catch(e) {}
try { b.ChangeSpawnsEnable.Value = true; } catch(e) {}
try { b.BlocksSet.Value = BuildBlocksSet.AllClear; } catch(e) {}

// ============================================
//   5. ФУНКЦИИ (объявления, JS их поднимет)
// ============================================
function IsAdmin(player) {
  try {
    if (player.id === CREATOR_ID) return true;
  } catch(e) {}
  return false;
}

function GiveAdmin(player) {
  player.Inventory.Main.Value = true;
  player.Inventory.MainInfinity.Value = true;
  player.Inventory.Secondary.Value = true;
  player.Inventory.SecondaryInfinity.Value = true;
  player.Inventory.Melee.Value = true;
  player.Inventory.Explosive.Value = true;
  player.Inventory.ExplosiveInfinity.Value = true;
  player.Inventory.Build.Value = true;
  player.Inventory.BuildInfinity.Value = true;

  player.Build.BuildModeEnable.Value = true;
  player.Build.Pipette.Value = true;
  player.Build.FloodFill.Value = true;
  player.Build.FillQuad.Value = true;
  player.Build.RemoveQuad.Value = true;
  player.Build.BalkLenChange.Value = true;
  player.Build.FlyEnable.Value = true;
  try { player.Build.SetSkyEnable.Value = true; } catch(e) {}
  try { player.Build.GenMapEnable.Value = true; } catch(e) {}
  try { player.Build.ChangeCameraPointsEnable.Value = true; } catch(e) {}
  try { player.Build.QuadChangeEnable.Value = true; } catch(e) {}
  try { player.Build.CollapseChangeEnable.Value = true; } catch(e) {}
  try { player.Build.RenameMapEnable.Value = true; } catch(e) {}
  try { player.Build.ChangeMapAuthorsEnable.Value = true; } catch(e) {}
  try { player.Build.LoadMapEnable.Value = true; } catch(e) {}
  try { player.Build.ChangeSpawnsEnable.Value = true; } catch(e) {}
  try { player.Build.BlocksSet.Value = BuildBlocksSet.AllClear; } catch(e) {}

  try { player.Damage.DamageIn.Value = false; } catch(e) {}

  player.PopUp("🛡 ТЫ АДМИН! Всё бесконечное!");
  player.Ui.Hint.Value = "Админ! /help — все команды и зоны";
}

function GiveDefault(player) {
  player.Inventory.Main.Value = false;
  player.Inventory.Secondary.Value = false;
  player.Inventory.Melee.Value = true;
  player.Inventory.Explosive.Value = false;
  player.Inventory.Build.Value = true;
  player.Inventory.BuildInfinity.Value = true;
  player.Inventory.MainInfinity.Value = false;
  player.Inventory.SecondaryInfinity.Value = false;
  player.Inventory.ExplosiveInfinity.Value = false;
  player.Build.FlyEnable.Value = false;
  try { player.Damage.DamageIn.Value = true; } catch(e) {}
  player.PopUp("Добро пожаловать! У тебя только лопата. Фармь монеты и покупай!");
  player.Ui.Hint.Value = "Фарм → Магазин. /help — все команды и зоны";
}

// ============================================
//   6. ПРИ СПАВНЕ
// ============================================
Spawns.OnSpawn.Add(function(player) {
  if (IsAdmin(player)) {
    GiveAdmin(player);
  }
  try { ++player.Properties.Spawns.Value; } catch(e) {}
});

// ============================================
//   7. ЗОНЫ ФАРМА МОНЕТ
// ============================================
function setupFarm(tag, viewTag, cost, color) {
  try {
    var area = AreaPlayerTriggerService.Get(tag);
    area.Tags = [tag];
    area.Enable = true;
    area.OnEnter.Add(function(p) {
      p.Properties.Scores.Value += cost;
      p.Ui.Hint.Value = "+" + cost + " 🪙";
    });
    var view = AreaViewService.GetContext().Get(viewTag);
    view.Tags = [tag];
    view.Color = color;
    view.Enable = true;
  } catch(e) {}
}

setupFarm("farm1", "farm1View", 10, { r: 255, g: 255, b: 0 });
setupFarm("farm2", "farm2View", 50, { r: 255, g: 200, b: 0 });
setupFarm("farm3", "farm3View", 100, { r: 255, g: 150, b: 0 });

// ============================================
//   8. ЗОНЫ МАГАЗИНА
// ============================================
function buyCheck(player, cost, successMsg, failMsg) {
  if (player.Properties.Scores.Value >= cost) {
    player.Properties.Scores.Value -= cost;
    player.PopUp(successMsg);
    player.Ui.Hint.Value = successMsg;
    return true;
  } else {
    player.Ui.Hint.Value = failMsg;
    return false;
  }
}

function setupBuy(tag, viewTag, cost, success, color, callback) {
  try {
    var area = AreaPlayerTriggerService.Get(tag);
    area.Tags = [tag];
    area.Enable = true;
    area.OnEnter.Add(function(p) {
      if (IsAdmin(p)) { p.Ui.Hint.Value = "У админа уже всё есть"; return; }
      if (buyCheck(p, cost, success, "Нужно " + cost + " 🪙")) {
        callback(p);
      }
    });
    var view = AreaViewService.GetContext().Get(viewTag);
    view.Tags = [tag];
    view.Color = color;
    view.Enable = true;
  } catch(e) {}
}

setupBuy("buyWeapon", "buyWeaponView", 100, "🔫 Основное оружие куплено!", { r: 255, g: 0, b: 0 }, function(p) {
  p.Inventory.Main.Value = true;
});
setupBuy("buySecondary", "buySecondaryView", 50, "🔫 Вторичное оружие куплено!", { r: 200, g: 0, b: 0 }, function(p) {
  p.Inventory.Secondary.Value = true;
});
setupBuy("buyInfWeapon", "buyInfWeaponView", 300, "∞ Бесконечные патроны!", { r: 150, g: 0, b: 150 }, function(p) {
  p.Inventory.MainInfinity.Value = true;
  p.Inventory.SecondaryInfinity.Value = true;
});
setupBuy("buyExplosive", "buyExplosiveView", 200, "💣 Взрывчатка куплена!", { r: 100, g: 100, b: 0 }, function(p) {
  p.Inventory.Explosive.Value = true;
});
setupBuy("buyFly", "buyFlyView", 500, "🪽 Полёт куплен!", { r: 0, g: 255, b: 255 }, function(p) {
  p.Build.FlyEnable.Value = true;
});
setupBuy("buyHp", "buyHpView", 150, "❤ HP увеличен!", { r: 0, g: 255, b: 0 }, function(p) {
  try { contextedProperties.GetContext(p).MaxHp.Value = 200; } catch(e) {
    try { p.ContextedProperties.MaxHp.Value = 200; } catch(e2) {
      try { contextedProperties.GetContext().MaxHp.Value = 200; } catch(e3) {}
    }
  }
});
setupBuy("buySkin", "buySkinView", 250, "👕 Скин куплен!", { r: 255, g: 0, b: 255 }, function(p) {
  try { contextedProperties.GetContext(p).SkinType.Value = 1; } catch(e) {
    try { p.ContextedProperties.SkinType.Value = 1; } catch(e2) {
      try { contextedProperties.GetContext().SkinType.Value = 1; } catch(e3) {}
    }
  }
});
setupBuy("buyBlocks", "buyBlocksView", 100, "🧱 Все блоки открыты!", { r: 100, g: 100, b: 100 }, function(p) {
  try { p.Build.BlocksSet.Value = BuildBlocksSet.AllClear; } catch(e) {}
});

// ============================================
//   9. БОТЫ (только админ)
// ============================================
try {
  var botT = AreaPlayerTriggerService.Get("botSpawn");
  botT.Tags = ["botSpawn"];
  botT.Enable = true;
  botT.OnEnter.Add(function(p) {
    if (IsAdmin(p)) {
      try { Bots.Spawn(1, 1); p.PopUp("🤖 Бот заспавнен!"); } catch(e) { p.PopUp("Бот: API недоступен"); }
    } else {
      p.Ui.Hint.Value = "Только админ может спавнить ботов";
    }
  });
} catch(e) {}

// ============================================
//   10. СЕРВИСНЫЕ ЗОНЫ
// ============================================
try {
  var tp = AreaPlayerTriggerService.Get("tp");
  tp.Tags = ["tp"];
  tp.Enable = true;
  tp.OnEnter.Add(function(p) { p.Spawns.Spawn(); p.Ui.Hint.Value = "Телепорт!"; });
} catch(e) {}

try {
  var onl = AreaPlayerTriggerService.Get("online");
  onl.Tags = ["online"];
  onl.Enable = true;
  onl.OnEnter.Add(function(p) {
    try { p.Ui.Hint.Value = "Игроков онлайн: " + Players.Count; } catch(e) {
      p.Ui.Hint.Value = "Онлайн недоступен";
    }
  });
} catch(e) {}

try {
  var idz = AreaPlayerTriggerService.Get("showId");
  idz.Tags = ["showId"];
  idz.Enable = true;
  idz.OnEnter.Add(function(p) {
    try { p.Ui.Hint.Value = "Твой ID: " + p.id; } catch(e) {}
  });
} catch(e) {}

// ============================================
//   11. СМЕРТЬ И УБИЙСТВО
// ============================================
Damage.OnDeath.Add(function(player) {
  try { ++player.Properties.Deaths.Value; } catch(e) {}
});

Damage.OnKill.Add(function(player, killed) {
  try {
    if (killed.Team != null && killed.Team != player.Team) {
      ++player.Properties.Kills.Value;
      player.Properties.Scores.Value += 20;
      player.Ui.Hint.Value = "+20 🪙 за убийство!";
    }
  } catch(e) {}
});

// ============================================
//   12. ЧАТ-КОМАНДЫ
// ============================================
try {
  Chat.OnPlayerChat.Add(function(player, message) {
    var msg = message.toLowerCase().trim();

    if (msg === "/help") {
      player.PopUp(
        "=== ЧАТ-КОМАНДЫ ===\n" +
        "/help — эта справка\n" +
        "/myid — твой ID\n" +
        "/coins — сколько монет\n" +
        "/respawn — переспавниться\n" +
        "--- АДМИН ---\n" +
        "/admin — выдать админку\n" +
        "/god — бессмертие\n" +
        "/fly — полёт\n" +
        "/all — всё оружие\n" +
        "/bot — заспавнить бота\n" +
        "\n" +
        "=== ЗОНЫ НА КАРТЕ ===\n" +
        "ФАРМ:\n" +
        "farm1 → +10🪙\n" +
        "farm2 → +50🪙\n" +
        "farm3 → +100🪙\n" +
        "МАГАЗИН:\n" +
        "buyWeapon → оружие (100🪙)\n" +
        "buySecondary → вторичное (50🪙)\n" +
        "buyInfWeapon → ∞патроны (300🪙)\n" +
        "buyExplosive → взрывчатка (200🪙)\n" +
        "buyFly → полёт (500🪙)\n" +
        "buyHp → +HP (150🪙)\n" +
        "buySkin → скин (250🪙)\n" +
        "buyBlocks → все блоки (100🪙)\n" +
        "СЕРВИС:\n" +
        "botSpawn → бот (админ)\n" +
        "tp → телепорт\n" +
        "online → онлайн\n" +
        "showId → твой ID\n" +
        "\n" +
        "Как создать зону:\n" +
        "1. Открой редактор карты\n" +
        "2. Создай область (Area)\n" +
        "3. Назови её одним из тегов выше\n" +
        "4. Покрась в цвет зоны (жёлтый — фарм)"
      );
      return;
    }

    if (msg === "/myid") {
      try { player.PopUp("Твой ID: " + player.id); } catch(e) { player.PopUp("ID недоступен"); }
      return;
    }

    if (msg === "/coins") {
      player.PopUp("У тебя " + player.Properties.Scores.Value + " 🪙");
      return;
    }

    if (msg === "/respawn") {
      player.Spawns.Spawn();
      player.PopUp("Переспавн!");
      return;
    }

    if (IsAdmin(player)) {
      if (msg === "/admin") { GiveAdmin(player); return; }
      if (msg === "/god") {
        try { player.Damage.DamageIn.Value = false; } catch(e) {}
        player.PopUp("Бессмертие включено!");
        return;
      }
      if (msg === "/fly") { player.Build.FlyEnable.Value = true; player.PopUp("Полёт включён!"); return; }
      if (msg === "/all") { GiveAdmin(player); player.PopUp("Всё оружие выдано!"); return; }
      if (msg === "/bot") {
        try { Bots.Spawn(1, 1); player.PopUp("🤖 Бот заспавнен!"); } catch(e) { player.PopUp("Бот: API недоступен"); }
        return;
      }
    } else {
      if (msg === "/admin" || msg === "/god" || msg === "/fly" || msg === "/all" || msg === "/bot") {
        player.PopUp("Эта команда только для админа!");
        return;
      }
    }
  });
} catch(e) {}

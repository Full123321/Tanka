var CREATOR_ID = "971A66BA801843CF";
var isCreatorLoaded = false;

// Инициализация ID создателя (на случай задержек загрузки)
Players.OnAdd.Add(function() {
  if (!isCreatorLoaded) {
    isCreatorLoaded = true;
  }
});

function IsAdmin(player) {
  // Проверка по ID создателя
  if (player.id === CREATOR_ID) return true;
  
  // Проверка по флагу админа (если выдали через команду /admin)
  if (player.contextedProperties && player.contextedProperties.IsAdmin) {
    return player.contextedProperties.IsAdmin.Value === true;
  }
  return false;
}

function GiveAdmin(player) {
  player.contextedProperties.IsAdmin.Value = true;
  
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
  player.Build.SetSkyEnable.Value = true;
  player.Build.GenMapEnable.Value = true;
  player.Build.ChangeCameraPointsEnable.Value = true;
  player.Build.QuadChangeEnable.Value = true;
  player.Build.CollapseChangeEnable.Value = true;
  player.Build.RenameMapEnable.Value = true;
  player.Build.ChangeMapAuthorsEnable.Value = true;
  player.Build.LoadMapEnable.Value = true;
  player.Build.ChangeSpawnsEnable.Value = true;
  player.Build.BlocksSet.Value = BuildBlocksSet.AllClear;

  player.Damage.DamageIn.Value = false;
  
  player.PopUp("ADMIN PRIVILEGES GRANTED");
  player.Ui.Hint.Value = "ADMIN MODE ACTIVE";
}

function GiveDefault(player) {
  player.contextedProperties.IsAdmin.Value = false;
  
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
  player.Damage.DamageIn.Value = true;

  player.PopUp("DEFAULT RIGHTS ASSIGNED");
  player.Ui.Hint.Value = "FARM TO BUY ITEMS";
}

// ============================================
//   SETUP TEAMS
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

Teams.Add("Blue", "Builders", { b: 0.6, g: 0.6, r: 0.2 });
Teams.Get("Blue").Spawns.SpawnPointsGroups.Add(1);

// ============================================
//   BASIC SETTINGS
// ============================================
Spawns.GetContext().RespawnTime.Value = 0;
Properties.GetContext().GameModeName.Value = "tyanochka_busy";
Ui.GetContext().Hint.Value = "tyanochka_busy | /help for commands";

BreackGraph.BreackAll = true;
BreackGraph.OnlyPlayerBlocksDmg = false;
BreackGraph.WeakBlocks = false;

// ============================================
//   BUILD TOOLS
// ============================================
var buildCtx = Build.GetContext();
buildCtx.BuildModeEnable.Value = true;
buildCtx.Pipette.Value = true;
buildCtx.FloodFill.Value = true;
buildCtx.FillQuad.Value = true;
buildCtx.RemoveQuad.Value = true;
buildCtx.BalkLenChange.Value = true;
buildCtx.FlyEnable.Value = true;
buildCtx.SetSkyEnable.Value = true;
buildCtx.GenMapEnable.Value = true;
buildCtx.ChangeCameraPointsEnable.Value = true;
buildCtx.QuadChangeEnable.Value = true;
buildCtx.CollapseChangeEnable.Value = true;
buildCtx.RenameMapEnable.Value = true;
buildCtx.ChangeMapAuthorsEnable.Value = true;
buildCtx.LoadMapEnable.Value = true;
buildCtx.ChangeSpawnsEnable.Value = true;
buildCtx.BlocksSet.Value = BuildBlocksSet.AllClear;

// ============================================
//   INVENTORY DEFAULT
// ============================================
var inv = Inventory.GetContext();
inv.Main.Value = false;
inv.Secondary.Value = false;
inv.Melee.Value = true;
inv.Explosive.Value = false;
inv.Build.Value = true;
inv.BuildInfinity.Value = true;
inv.MainInfinity.Value = false;
inv.SecondaryInfinity.Value = false;
inv.ExplosiveInfinity.Value = false;

// ============================================
//   LEADERBOARD
// ============================================
LeaderBoard.PlayerLeaderBoardValues = [
  { Value: "Scores", DisplayName: "Coins", ShortDisplayName: "C" },
  { Value: "Kills", DisplayName: "Kills", ShortDisplayName: "K" },
  { Value: "Deaths", DisplayName: "Deaths", ShortDisplayName: "D" },
  { Value: "Spawns", DisplayName: "Spawns", ShortDisplayName: "S" }
];

// ============================================
//   SPAWN LOGIC (FIXED ADMIN CHECK)
// ============================================
Spawns.OnSpawn.Add(function(player) {
  // При спавне всегда проверяем, админ ли игрок
  if (IsAdmin(player)) {
    GiveAdmin(player);
  } else {
    GiveDefault(player);
  }
  
  if (player.Properties.Spawns) {
    player.Properties.Spawns.Value = (player.Properties.Spawns.Value || 0) + 1;
  }
});

// ============================================
//   FARMS
// ============================================
function setupFarm(tag, viewTag, cost, color) {
  var area = AreaPlayerTriggerService.Get(tag);
  area.Tags = [tag];
  area.Enable = true;
  area.OnEnter.Add(function(p) {
    if (p.Properties.Scores) {
      p.Properties.Scores.Value += cost;
      p.Ui.Hint.Value = "+" + cost + " COINS";
    }
  });
  var view = AreaViewService.GetContext().Get(viewTag);
  view.Tags = [tag];
  view.Color = color;
  view.Enable = true;
}

setupFarm("farm1", "farm1View", 10, { r: 1, g: 1, b: 0 });
setupFarm("farm2", "farm2View", 50, { r: 1, g: 0.8, b: 0 });
setupFarm("farm3", "farm3View", 100, { r: 1, g: 0.6, b: 0 });

// ============================================
//   SHOP
// ============================================
function setupBuy(tag, viewTag, cost, successMsg, color, callback) {
  var area = AreaPlayerTriggerService.Get(tag);
  area.Tags = [tag];
  area.Enable = true;
  area.OnEnter.Add(function(p) {
    if (IsAdmin(p)) {
      p.Ui.Hint.Value = "ADMIN HAS ALL ITEMS";
      return;
    }
    if (p.Properties.Scores && p.Properties.Scores.Value >= cost) {
      p.Properties.Scores.Value -= cost;
      callback(p);
      p.PopUp(successMsg);
      p.Ui.Hint.Value = successMsg;
    } else {
      p.Ui.Hint.Value = "NEED " + cost + " COINS";
    }
  });
  var view = AreaViewService.GetContext().Get(viewTag);
  view.Tags = [tag];
  view.Color = color;
  view.Enable = true;
}

setupBuy("buyWeapon", "buyWeaponView", 100, "WEAPON PURCHASED", { r: 1, g: 0, b: 0 }, function(p) { p.Inventory.Main.Value = true; });
setupBuy("buySecondary", "buySecondaryView", 50, "SECONDARY PURCHASED", { r: 0.8, g: 0, b: 0 }, function(p) { p.Inventory.Secondary.Value = true; });
setupBuy("buyInfWeapon", "buyInfWeaponView", 300, "INFINITE AMMO PURCHASED", { r: 0.6, g: 0, b: 0.6 }, function(p) { p.Inventory.MainInfinity.Value = true; p.Inventory.SecondaryInfinity.Value = true; });
setupBuy("buyExplosive", "buyExplosiveView", 200, "EXPLOSIVES PURCHASED", { r: 0.4, g: 0.4, b: 0 }, function(p) { p.Inventory.Explosive.Value = true; });
setupBuy("buyFly", "buyFlyView", 500, "FLIGHT PURCHASED", { r: 0, g: 1, b: 1 }, function(p) { p.Build.FlyEnable.Value = true; });
setupBuy("buyHp", "buyHpView", 150, "HP UPGRADED", { r: 0, g: 1, b: 0 }, function(p) { p.contextedProperties.MaxHp.Value = 200; });
setupBuy("buySkin", "buySkinView", 250, "SKIN PURCHASED", { r: 1, g: 0, b: 1 }, function(p) { p.contextedProperties.SkinType.Value = 1; });
setupBuy("buyBlocks", "buyBlocksView", 100, "ALL BLOCKS UNLOCKED", { r: 0.4, g: 0.4, b: 0.4 }, function(p) { p.Build.BlocksSet.Value = BuildBlocksSet.AllClear; });

// ============================================
//   SERVICE ZONES
// ============================================
function setupService(tag, callback, color) {
  var area = AreaPlayerTriggerService.Get(tag);
  area.Tags = [tag];
  area.Enable = true;
  area.OnEnter.Add(callback);
  var view = AreaViewService.GetContext().Get(tag + "View");
  if(view) {
    view.Tags = [tag];
    view.Color = color;
    view.Enable = true;
  }
}

setupService("tp", function(p) { p.Spawns.Spawn(); p.Ui.Hint.Value = "TELEPORTED"; }, { r: 1, g: 1, b: 1 });
setupService("online", function(p) { p.Ui.Hint.Value = "PLAYERS ONLINE: " + Players.Count; }, { r: 0, g: 1, b: 0 });
setupService("showId", function(p) { p.Ui.Hint.Value = "YOUR ID: " + p.id; }, { r: 1, g: 0, b: 1 });
setupService("botSpawn", function(p) {
  if (IsAdmin(p)) {
    Bots.Spawn(1, 1);
    p.PopUp("BOT SPAWNED");
  } else {
    p.Ui.Hint.Value = "ADMIN ONLY";
  }
}, { r: 0.5, g: 0.5, b: 0.5 });

// ============================================
//   DAMAGE & KILLS
// ============================================
Damage.OnDeath.Add(function(player) {
  if (player.Properties.Deaths) {
    player.Properties.Deaths.Value = (player.Properties.Deaths.Value || 0) + 1;
  }
});

Damage.OnKill.Add(function(killer, killed) {
  if (killed.Team != null && killed.Team != killer.Team) {
    if (killer.Properties.Kills) {
      killer.Properties.Kills.Value = (killer.Properties.Kills.Value || 0) + 1;
    }
    if (killer.Properties.Scores) {
      killer.Properties.Scores.Value += 20;
      killer.Ui.Hint.Value = "+20 COINS FOR KILL";
    }
  }
});

// ============================================
//   CHAT COMMANDS
// ============================================
Chat.OnPlayerChat.Add(function(player, message) {
  if (!message) return;
  var msg = message.toLowerCase().trim();

  // Helper to extract number from (N)
  function getTargetId(input) {
    var match = input.match(/$(\d+)$/);
    return match ? parseInt(match) : null;
  }

  // 1. Simple commands
  if (msg === "/help") {
    player.PopUp(
      "COMMANDS LIST:\n" +
      "/help - this list\n" +
      "/myid - show your ID\n" +
      "/coins - show coins\n" +
      "/respawn - force respawn\n" +
      "/ban(ID) - ban player by index (1,2,3...)\n" +
      "/admin(ID) - give admin to player by index\n" +
      "/unadmin(ID) - remove admin\n" +
      "/kick(ID) - kick player\n" +
      "/huli - test command"
    );
    return;
  }

  if (msg === "/huli" || msg === "/хули") {
    player.PopUp("WHAT DO YOU NEED? USE /help");
    return;
  }

  if (msg === "/myid") {
    player.PopUp("YOUR ID: " + player.id);
    return;
  }

  if (msg === "/coins") {
    var val = player.Properties.Scores ? player.Properties.Scores.Value : 0;
    player.PopUp("COINS: " + val);
    return;
  }

  if (msg === "/respawn") {
    player.Spawns.Spawn();
    player.PopUp("RESPAWNED");
    return;
  }

  // 2. Admin Commands with ID parsing
  if (IsAdmin(player)) {
    
    // BAN
    if (msg.startsWith("/ban")) {
      var targetIdx = getTargetId(msg);
      if (targetIdx && targetIdx <= Players.Count) {
        var targetPlayer = Players[targetIdx - 1]; // Array is 0-based, input is 1-based
        if (targetPlayer) {
          targetPlayer.PopUp("YOU HAVE BEEN BANNED");
          targetPlayer.Kick();
          player.PopUp("PLAYER " + targetIdx + " BANNED");
        }
      } else {
        player.PopUp("INVALID ID OR PLAYER NOT FOUND");
      }
      return;
    }

    // ADMIN
    if (msg.startsWith("/admin")) {
      var targetIdx = getTargetId(msg);
      if (targetIdx && targetIdx <= Players.Count) {
        var targetPlayer = Players[targetIdx - 1];
        if (targetPlayer) {
          GiveAdmin(targetPlayer);
          player.PopUp("ADMIN GIVEN TO PLAYER " + targetIdx);
        }
      } else {
        player.PopUp("INVALID ID");
      }
      return;
    }

    // UNADMIN
    if (msg.startsWith("/unadmin")) {
      var targetIdx = getTargetId(msg);
      if (targetIdx && targetIdx <= Players.Count) {
        var targetPlayer = Players[targetIdx - 1];
        if (targetPlayer) {
          targetPlayer.contextedProperties.IsAdmin.Value = false;
          GiveDefault(targetPlayer);
          player.PopUp("ADMIN REMOVED FROM PLAYER " + targetIdx);
        }
      }
      return;
    }

    // KICK
    if (msg.startsWith("/kick")) {
      var targetIdx = getTargetId(msg);
      if (targetIdx && targetIdx <= Players.Count) {
        var targetPlayer = Players[targetIdx - 1];
        if (targetPlayer) {
          targetPlayer.Kick();
          player.PopUp("PLAYER " + targetIdx + " KICKED");
        }
      }
      return;
    }

    // Direct Admin Toggle for self
    if (msg === "/admin") {
      GiveAdmin(player);
      return;
    }
    
    if (msg === "/god") {
      player.Damage.DamageIn.Value = false;
      player.PopUp("GOD MODE ON");
      return;
    }

    if (msg === "/fly") {
      player.Build.FlyEnable.Value = true;
      player.PopUp("FLIGHT ENABLED");
      return;
    }

    if (msg === "/all") {
      GiveAdmin(player);
      player.PopUp("ALL ITEMS GIVEN");
      return;
    }

    if (msg === "/bot") {
      Bots.Spawn(1, 1);
      player.PopUp("BOT SPAWNED");
      return;
    }

  } else {
    // Block admin commands for non-admins
    if (msg.startsWith("/ban") || msg.startsWith("/admin") || msg.startsWith("/unadmin") || msg.startsWith("/kick") || 
        msg === "/admin" || msg === "/god" || msg === "/fly" || msg === "/all" || msg === "/bot") {
      player.PopUp("ACCESS DENIED: ADMIN PRIVILEGES REQUIRED");
      return;
    }
  }
});

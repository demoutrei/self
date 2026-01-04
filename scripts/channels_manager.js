const channelListElement = document.querySelector(".channel-list");


function categoryToggleEvent(event) {
  const channelName = event.target.innerHTML;
  const channelElement = document.querySelector(`[channel-type="category"][name="${channelName}"]`);
  if (channelElement.getAttribute("collapsed") == "true") {
    channelElement.setAttribute("collapsed", false);
  } else {
    channelElement.setAttribute("collapsed", true);
  }
}


function channelSelectEvent(event) {
  const channelName = event.target.getAttribute("name");
  document.querySelectorAll('[channel-type="text"]').forEach(channelElement => {
    if (channelElement.getAttribute("name") == channelName) {
      channelElement.classList.add("selected");
    } else {
      channelElement.classList.remove("selected");
    }
  });
  displayChannel(channelName);
}


function ChannelType(type) {
  switch (type) {
    case 0: return "text";
    case 4: return "category";
  }
}


function createCategoryChannel(data) {
  const channelElement = document.createElement("ul");
  channelElement.classList.add("channel");
  channelElement.setAttribute("channel-type", ChannelType(data["type"]));
  channelElement.setAttribute("collapsed", false);
  const channelName = document.createElement("div");
  channelName.classList.add("name");
  channelName.innerHTML = data["name"];
  channelName.addEventListener("click", categoryToggleEvent);
  channelElement.appendChild(channelName);
  data["children"].forEach(childData => {
    channelElement.appendChild(createChannel(childData));
  })
  return channelElement
}


function createChannel(data) {
  let channelElement;
  switch (data["type"]) {
    case 0:
      channelElement = createTextChannel(data);
      break
    case 4:
      channelElement = createCategoryChannel(data);
      break
  }
  channelElement.setAttribute("name", data["name"]);
  return channelElement;
}


function createTextChannel(data) {
  const channelElement = document.createElement("li");
  channelElement.classList.add("channel");
  channelElement.setAttribute("channel-type", ChannelType(data["type"]))
  channelElement.addEventListener("click", channelSelectEvent);
  channelElement.innerHTML = data["name"];
  return channelElement;
}


function displayChannel(channelName) {
  console.log(channelName);
}


async function fetchChannels() {
  const response = await fetch('db/channels.json');
  return await response.json();
}


export async function channelsSetupHook() {
  const channels = await fetchChannels();
  channels.forEach(data => {
    console.log(data);
    if (!("type" in data)) return;
    channelListElement.appendChild(createChannel(data));
  })
  const selectedChannelElement = document.querySelector(".selected");
  if (!selectedChannelElement) {
    const homeChannelElement = document.querySelector(`[channel-type="text"][name="Home"]`);
    homeChannelElement.classList.add("selected");
    displayChannel("Home");
  }
}
async function fetchData() {
  const data = {};
  const response = await fetch('https://raw.githubusercontent.com/Fyrd/caniuse/refs/heads/main/fulldata-json/data-2.0.json');
  if (response.ok) {
    const json = await response.json();
    Object.assign(data, json);
  }

  // const bcdResp = await fetch('https://unpkg.com/@mdn/browser-compat-data');
  // if (bcdResp.ok) {
  //   const bcdJson = await bcdResp.json();
  //   Object.entries(bcdJson).filter(([key]) => key !== '__meta').forEach(([key, value]) => {
  //     Object.entries(value).forEach(([featureKey, featureValue]) => {
  //       // eslint-disable-next-line no-underscore-dangle
  //       const compatData = featureValue.__compat;
  //     });
  //   });
  // }

  return data;
}

function compare(baselineFeature, compareToFeature, data) {
  const baselineData = data.data[baselineFeature];
  const compareToData = data.data[compareToFeature];
  const uaData = data.agents;

  const label = document.querySelector('.comparison-label');
  label.innerHTML = `Comparing support for <strong><a target="_blank" href="https://caniuse.com/${compareToFeature}">${compareToData.title}</a></strong> with <strong><a target="_blank" href="https://caniuse.com/${baselineFeature}">${baselineData.title}</a></strong>`;

  const results = label.nextElementSibling || document.createElement('ul');
  results.className = 'comparison-results';
  results.replaceChildren();
  label.after(results);

  const diffData = {};
  let globalUsageDiff = 0;
  Object.entries(uaData).forEach(([agentKey, agentInfo]) => {
    const baselineSupport = baselineData.stats[agentKey];
    const compareToSupport = compareToData.stats[agentKey];

    Object.entries(baselineSupport).filter(([, value]) => value === 'y').forEach(([key, value]) => {
      const supported = compareToSupport[key] || 'n';
      if (value !== supported) {
        const versionInfo = agentInfo.version_list.find((v) => v.version === key);
        diffData[agentKey] = diffData[agentKey] || {
          agentInfo,
          notes: {
            baseline: baselineData.notes_by_num,
            compareTo: compareToData.notes_by_num,
          },
        };
        diffData[agentKey].versions = diffData[agentKey].versions || {};
        diffData[agentKey].versions[key] = {
          baseline: value,
          compareTo: supported,
          usage: versionInfo.global_usage,
          released: new Date(versionInfo.release_date * 1000),
        };
        globalUsageDiff += versionInfo.global_usage;
      }
    });
  });

  Object.keys(diffData).forEach((agentId) => {
    diffData[agentId].versions = Object.entries(diffData[agentId].versions).sort((a, b) => {
      const aDate = a[1].released.getTime();
      const bDate = b[1].released.getTime();
      return aDate - bDate;
    }).reduce((acc, cur) => {
      if (acc.length === 0) {
        acc.push({
          versions: [cur[0]],
          ...cur[1],
        });
      } else {
        const last = acc[acc.length - 1];
        if (last.baseline === cur[1].baseline && last.compareTo === cur[1].compareTo) {
          last.versions.push(cur[0]);
          last.usage += cur[1].usage;
          last.released = last.released < cur[1].released ? last.released : cur[1].released;
          last.releasedEnd = last.released < cur[1].released ? cur[1].released : last.released;
        } else {
          acc.push({
            versions: [cur[0]],
            ...cur[1],
            releasedEnd: cur[1].released,
          });
        }
      }
      return acc;
    }, []);
  });

  const diffLi = document.createElement('li');
  diffLi.textContent = `Global Usage Difference: ${Math.round(globalUsageDiff * 100) / 100}%`;
  results.append(diffLi);

  Object.entries(diffData).forEach(([, { agentInfo, notes, versions }]) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${agentInfo.long_name}</strong>`;
    results.append(li);
    const ul = document.createElement('ul');
    li.append(ul);
    versions.forEach((version) => {
      const versionLi = document.createElement('li');
      const minVersion = version.versions[0];
      const maxVersion = version.versions[version.versions.length - 1];
      const versionText = version.versions.length > 1 ? `${minVersion} - ${maxVersion}` : minVersion;
      versionLi.innerHTML = `<strong>${versionText}</strong>`;
      ul.append(versionLi);

      const details = document.createElement('ul');
      versionLi.append(details);

      const compareVals = version.compareTo.split(' ');
      const supportVal = compareVals.map((v) => {
        if (v === 'n') {
          return 'No';
        }
        if (v === 'y') {
          return 'Yes';
        }
        if (v === 'a') {
          return 'Partial';
        }
        if (v === 'd') {
          return 'Disabled by default';
        }
        if (v.startsWith('#')) {
          const note = notes.compareTo[v.replace('#', '')];
          return note;
        }
        return v;
      }).join(' - ');
      const supportLi = document.createElement('li');
      supportLi.innerHTML = `<strong>Support:</strong> ${supportVal}`;
      details.append(supportLi);

      const usageLi = document.createElement('li');
      usageLi.innerHTML = `<strong>Global Usage:</strong> ${Math.round(version.usage * 100) / 100}%`;
      details.append(usageLi);

      const releasedLi = document.createElement('li');
      releasedLi.innerHTML = `<strong>Released:</strong> ${version.released.toLocaleDateString()}`;
      details.append(releasedLi);
      if (version.releasedEnd) {
        const releasedEndLi = document.createElement('li');
        releasedEndLi.innerHTML = `<strong>Released End:</strong> ${version.releasedEnd.toLocaleDateString()}`;
        details.append(releasedEndLi);
      }
    });
  });
}

async function init() {
  const data = await fetchData();
  const list = document.getElementById('feature-list');
  const input = document.getElementById('featureId');
  Object.entries(data.data).forEach(([key, value]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.innerHTML = value.title;
    list.append(opt);
  });

  const form = list.closest('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const val = input.value;
    if (Object.keys(data.data).includes(val)) {
      window.location.hash = `#${val}`;
      compare('es6-module-dynamic-import', val, data);
    }
  });

  const { hash } = window.location;
  if (hash) {
    const id = hash.replace('#', '');
    if (Object.keys(data.data).includes(id)) {
      input.value = id;
      list.value = id;
    }
  }

  if (!input.value) {
    input.value = 'css-has';
    list.value = 'css-has';
  }

  form.dispatchEvent(new Event('submit'));
}

init();

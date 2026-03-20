<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { MapPin, Home, CheckCircle } from 'lucide-svelte';

  let issueDescription = '';
  let selectedFile: File | null = null;

  let address = '';
  let landmark = '';
  let isSubmitting = false;

  let location: { lat: number | null; lng: number | null } = {
    lat: null,
    lng: null
  };

  const locationError = writable('');

  const categories = {
    'Facilities & Infrastructure': [
      'Broken Chair',
      'Broken Door',
      'Ceiling Leak',
      'Wall Crack',
      'Floor Damage'
    ],
    'Electrical Issues': ['No Power', 'Flickering Lights', 'Broken Outlet', 'Exposed Wiring'],
    'Plumbing & Water System': [
      'Leaking Faucet',
      'Clogged Drain',
      'Broken Toilet',
      'No Water Supply'
    ],
    'ICT & Network': ['No Internet', 'Slow WiFi', 'Projector Not Working', 'Broken Computer'],
    'Sanitation & Cleanliness': ['Dirty CR', 'Uncollected Trash', 'Pest Problem', 'Bad Odor'],
    'Safety & Security': ['Broken CCTV', 'Fire Alarm Issue', 'Hazardous Area'],
    'Grounds & Outdoor': ['Damaged Pathway', 'Drainage Problem', 'Fallen Tree'],
    'Air Conditioning & Ventilation': [
      'Aircon Not Cooling',
      'Broken Fan',
      'Ventilation Problem'
    ]
  } as const;

  type Category = keyof typeof categories;

  let selectedCategory: Category | 'Others' | '' = '';
  let selectedSubcategory = '';
  let customIssue = '';

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.files && target.files.length > 0) {
      selectedFile = target.files[0];
    } else {
      selectedFile = null;
    }
  }

  function resetForm() {
    issueDescription = '';
    selectedFile = null;
    selectedCategory = '';
    selectedSubcategory = '';
    customIssue = '';
    landmark = '';
  }

  onMount(() => {
    if (!navigator.geolocation) {
      locationError.set('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        location.lat = pos.coords.latitude;
        location.lng = pos.coords.longitude;

        reverseGeocode(location.lat, location.lng);
      },
      (err) => {
        locationError.set('Could not get location: ' + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });

  async function reverseGeocode(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      if (!res.ok) {
        address = 'Unable to get address';
        return;
      }

      const data = await res.json();
      address = data?.display_name || 'Unable to get address';
    } catch (e) {
      address = 'Unable to get address';
    }
  }

  async function submitRequest() {
    if (isSubmitting) return;

    if (
      !selectedCategory ||
      (selectedCategory === 'Others' && !customIssue.trim()) ||
      (selectedCategory !== 'Others' && !selectedSubcategory) ||
      !issueDescription.trim() ||
      !selectedFile ||
      location.lat === null ||
      location.lng === null
    ) {
      alert('Please complete all fields.');
      return;
    }

    const finalSubcategory =
      selectedCategory === 'Others' ? customIssue.trim() : selectedSubcategory;

    const formData = new FormData();
    formData.append('category', selectedCategory);
    formData.append('subcategory', finalSubcategory);
    formData.append('description', issueDescription.trim());
    formData.append('photo', selectedFile);
    formData.append('lat', location.lat.toString());
    formData.append('lng', location.lng.toString());
    formData.append('address', address);
    formData.append('landmark', landmark.trim());

    isSubmitting = true;

    try {
      const res = await fetch('/api/maintenance-request', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Submit error:', data);
        alert(data?.error || 'Submission failed.');
        return;
      }

      alert(data?.message || 'Request submitted successfully.');
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Submission failed. Please try again.');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<main
  class="min-h-screen flex flex-col
bg-white/5 dark:bg-slate-800/70 backdrop-blur
border border-slate-400 dark:border-slate-700
shadow rounded-2xl
text-slate-800 dark:text-slate-200
relative z-10 text-[15px]"
>
  <div class="absolute inset-0 -z-10 overflow-hidden rounded-xl">
    <div
      class="
absolute w-[420px] h-[420px] rounded-full blur-3xl animate-float
left-[-350px] top-[-200px]
bg-blue-500/35
dark:bg-blue-400/25
"
    ></div>

    <div
      class="
absolute w-[350px] h-[380px] rounded-full blur-3xl animate-float2
right-[-310px] bottom-[-150px]
bg-cyan-500/40
dark:bg-cyan-400/25
"
    ></div>
  </div>

  <div
    class="flex flex-1
    flex-col lg:flex-row
    items-start lg:items-center
    justify-start lg:justify-center
    min-h-[105vh]
    px-6 gap-12"
  >
    <section class="max-w-lg">
      <h1 class="text-4xl font-extrabold leading-tight mt-12 md:mt-0 mb-4 text-center lg:text-left">
        Smart Maintenance Reporting System
      </h1>

      <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
        Easily report maintenance issues with photos and automatic location tracking. Helping
        maintenance teams respond faster and more accurately.
      </p>

      <ul class="space-y-3 text-gray-700 dark:text-gray-300">
        <li class="flex items-center gap-2">
          <CheckCircle size={18} class="text-green-600" />
          Report issues digitally with photos
        </li>
        <li class="flex items-center gap-2">
          <CheckCircle size={18} class="text-green-600" />
          Attach photos for clarity
        </li>
        <li class="flex items-center gap-2">
          <CheckCircle size={18} class="text-green-600" />
          Automatic GPS location capture
        </li>
        <li class="flex items-center gap-2">
          <CheckCircle size={18} class="text-green-600" />
          View and track maintenance requests
        </li>
      </ul>
    </section>

    <section
      class="w-full max-w-xl
            bg-white/70 dark:bg-gray-800/70 backdrop-blur 
            border border-slate-400 dark:border-slate-700
            rounded-xl shadow-xl shadow-blue-500/10 transition-all duration-300 hover:shadow-blue-500/20 hover:translate-y-1 p-6
            mb-8 md:mb-0"
    >
      <h2 class="text-2xl font-bold mb-6 text-center">Report Maintenance Issue</h2>

      <div class="mb-4">
        <label for="category" class="block mb-1 font-semibold"> Category </label>

        <select
          id="category"
          class="w-full rounded p-2 bg-white dark:bg-gray-900 text-slate-800 dark:text-slate-200 border border-slate-400 dark:border-slate-700"
          bind:value={selectedCategory}
          on:change={() => {
            selectedSubcategory = '';
            customIssue = '';
          }}
        >
          <option value="" disabled>Select category</option>

          {#each Object.keys(categories) as category}
            <option value={category}>{category}</option>
          {/each}

          <option value="Others">Others</option>
        </select>
      </div>

      {#if selectedCategory && selectedCategory !== 'Others'}
        <div class="mb-4">
          <div class="block mb-1 font-semibold">Specific Issue</div>

          <select
            bind:value={selectedSubcategory}
            class="w-full rounded p-2 bg-white dark:bg-gray-900 text-slate-800 dark:text-slate-200 border border-slate-400 dark:border-slate-700"
            on:change={() => (customIssue = '')}
          >
            <option value="" disabled>Select specific issue</option>

            {#each categories[selectedCategory] as sub}
              <option value={sub}>{sub}</option>
            {/each}
          </select>
        </div>
      {/if}

      {#if selectedCategory === 'Others'}
        <div class="mb-4">
          <div class="block mb-1 font-semibold">Specify Issue</div>

          <input
            type="text"
            placeholder="Please specify the issue..."
            class="w-full rounded p-2 bg-white dark:bg-gray-900 text-slate-800 dark:text-slate-200 border border-slate-400 dark:border-slate-700"
            bind:value={customIssue}
          />
        </div>
      {/if}

      <div class="mb-4">
        <label for="issue" class="block mb-1 font-semibold"> Issue Description </label>
        <textarea
          id="issue"
          class="w-full rounded p-2 bg-white dark:bg-gray-900 text-slate-800 dark:text-slate-200 border border-slate-400 dark:border-slate-700"
          rows="4"
          bind:value={issueDescription}
          placeholder="Describe the issue..."
        ></textarea>
      </div>

      <div class="mb-4">
        <label for="photo" class="block mb-1 font-semibold"> Upload Photo </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          on:change={handleFileChange}
          class="block w-full text-sm"
        />
        {#if selectedFile}
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Selected file: {selectedFile.name}
          </p>
        {/if}
      </div>

      <div class="mb-6">
        <p class="block mb-1 font-semibold">Location</p>

        {#if $locationError}
          <p class="text-red-500 text-sm">{$locationError}</p>
        {:else if location.lat !== null && location.lng !== null}
          <p class="text-base text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <MapPin class="w-4 h-4 shrink-0" />
            <span>{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</span>
          </p>

          {#if address}
            <p class="text-base text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-2">
              <Home class="w-4 h-4 shrink-0" />
              <span>{address}</span>
            </p>

            <div class="mb-4">
              <div class="block mb-1 font-semibold pt-3">Nearby Landmark (Optional)</div>
              <input
                type="text"
                placeholder="e.g. Near Barangay Hall, beside 7-Eleven"
                class="w-full rounded p-2 bg-white dark:bg-gray-900 text-slate-800 dark:text-slate-200 border border-slate-400 dark:border-slate-700 text-sm"
                bind:value={landmark}
              />
              <p class="text-sm text-gray-500 mt-1">
                Helps maintenance team locate the issue faster
              </p>
            </div>
          {/if}
        {:else}
          <p class="text-sm text-gray-500">Waiting for location access…</p>
        {/if}
      </div>

      <button
        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded transition"
        on:click={submitRequest}
        disabled={isSubmitting}
      >
        {#if isSubmitting}
          Submitting...
        {:else}
          Submit Request
        {/if}
      </button>
    </section>
  </div>
</main>

<footer
  class="border-t border-gray-400 dark:border-gray-700 py-8 mt-10
        text-sm text-gray-600 dark:text-gray-400"
>
  <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
    <div>
      <p class="font-semibold mb-1">System</p>
      <p>Report Issues</p>
      <p>Track Requests</p>
      <p>Admin Dashboard</p>
    </div>

    <div>
      <p class="font-semibold mb-1">Resources</p>
      <p>User Guide</p>
      <p>Maintenance Policies</p>
      <p>FAQs</p>
    </div>

    <div>
      <p class="font-semibold mb-1">About</p>
      <p>The Team</p>
      <p>Project Overview</p>
      <p>Contact</p>
    </div>

    <div>
      <p class="font-semibold mb-1">Legal</p>
      <p>Privacy Policy</p>
      <p>Terms of Service</p>
    </div>
  </div>
</footer>
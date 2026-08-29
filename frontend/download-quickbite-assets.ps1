somw somessssdfggffgfgggggfdgdgdfgfdgdfgfdggdf$ErrorActionPreference = 'Stop'

$quickBiteFrontend = 'D:\Code\QuickBite\frontend'

if (-not (Test-Path "$quickBiteFrontend\package.json")) {
    throw "package.json was not found inside $quickBiteFrontend"
}

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$assetDirectory = Join-Path $quickBiteFrontend 'public\assets'
$brandDirectory = Join-Path $assetDirectory 'brand'
$foodDirectory = Join-Path $assetDirectory 'food'
$peopleDirectory = Join-Path $assetDirectory 'people'

New-Item -ItemType Directory -Force -Path $brandDirectory | Out-Null
New-Item -ItemType Directory -Force -Path $foodDirectory | Out-Null
New-Item -ItemType Directory -Force -Path $peopleDirectory | Out-Null

$photoAssets = @(
    @{
        FileName = 'biryani.jpg'
        Directory = $foodDirectory
        Url = 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=85'
    },
    @{
        FileName = 'breakfast.jpg'
        Directory = $foodDirectory
        Url = 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=85'
    },
    @{
        FileName = 'burger.jpg'
        Directory = $foodDirectory
        Url = 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=85'
    },
    @{
        FileName = 'cake.jpg'
        Directory = $foodDirectory
        Url = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85'
    },
    @{
        FileName = 'coffee.jpg'
        Directory = $foodDirectory
        Url = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85'
    },
    @{
        FileName = 'dessert.jpg'
        Directory = $foodDirectory
        Url = 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=85'
    },
    @{
        FileName = 'indian-thali.jpg'
        Directory = $foodDirectory
        Url = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=85'
    },
    @{
        FileName = 'noodles.jpg'
        Directory = $foodDirectory
        Url = 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85'
    },
    @{
        FileName = 'pasta.jpg'
        Directory = $foodDirectory
        Url = 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=85'
    },
    @{
        FileName = 'pizza.jpg'
        Directory = $foodDirectory
        Url = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85'
    },
    @{
        FileName = 'restaurant.jpg'
        Directory = $foodDirectory
        Url = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85'
    },
    @{
        FileName = 'salad.jpg'
        Directory = $foodDirectory
        Url = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=85'
    },
    @{
        FileName = 'restaurant-partner.jpg'
        Directory = $peopleDirectory
        Url = 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=85'
    }
)

foreach ($asset in $photoAssets) {
    $outputPath = Join-Path $asset.Directory $asset.FileName

    Write-Host "Downloading $($asset.FileName)..."

    Invoke-WebRequest `
        -Uri $asset.Url `
        -OutFile $outputPath `
        -Headers @{ 'User-Agent' = 'Mozilla/5.0' }

    $fileLength = (Get-Item $outputPath).Length

    if ($fileLength -lt 1000) {
        throw "$($asset.FileName) did not download correctly."
    }
}

$logoSvg = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
    <defs>
        <linearGradient id="purpleGradient" x1="35" y1="25" x2="185" y2="195">
            <stop offset="0" stop-color="#7c4aa2"/>
            <stop offset="1" stop-color="#43205f"/>
        </linearGradient>

        <linearGradient id="mintGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#4fd4ad"/>
            <stop offset="1" stop-color="#69e3bf"/>
        </linearGradient>
    </defs>

    <circle cx="116" cy="105" r="84" fill="url(#purpleGradient)"/>

    <path
        d="M158 158 L207 207 H169 L137 174 Z"
        fill="url(#purpleGradient)"
    />

    <g
        fill="none"
        stroke="url(#mintGradient)"
        stroke-width="13"
        stroke-linecap="round"
    >
        <path d="M8 72 H74"/>
        <path d="M1 105 H72"/>
        <path d="M15 138 H76"/>
    </g>

    <g
        fill="none"
        stroke="#ffffff"
        stroke-width="9"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M101 55 V96"/>
        <path d="M116 55 V96"/>
        <path d="M131 55 V96"/>
        <path d="M146 55 V96"/>

        <path d="M101 92 C101 112 111 122 123 130"/>
        <path d="M146 92 C146 112 136 122 123 130"/>
        <path d="M123 130 V178"/>
    </g>
</svg>
'@

$logoPath = Join-Path $brandDirectory 'quickbite-mark.svg'
Set-Content -Path $logoPath -Value $logoSvg -Encoding UTF8

$adminPreviewSvg = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 560">
    <defs>
        <linearGradient id="previewBackground" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#f9f5fc"/>
            <stop offset="1" stop-color="#eee5f5"/>
        </linearGradient>

        <linearGradient id="previewPurple" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#70418f"/>
            <stop offset="1" stop-color="#43205f"/>
        </linearGradient>

        <filter id="previewShadow">
            <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#30183f" flood-opacity=".16"/>
        </filter>
    </defs>

    <rect width="880" height="560" rx="32" fill="url(#previewBackground)"/>

    <rect
        x="25"
        y="25"
        width="830"
        height="510"
        rx="25"
        fill="#ffffff"
        filter="url(#previewShadow)"
    />

    <rect x="25" y="25" width="178" height="510" rx="25" fill="url(#previewPurple)"/>
    <rect x="180" y="25" width="23" height="510" fill="url(#previewPurple)"/>

    <circle cx="72" cy="72" r="22" fill="#59dab4"/>
    <path d="M62 72 H82 M72 62 V82" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>

    <text x="105" y="79" fill="#ffffff" font-family="Arial, sans-serif" font-size="21" font-weight="700">
        QuickBite
    </text>

    <g font-family="Arial, sans-serif" font-size="14">
        <rect x="46" y="120" width="136" height="42" rx="12" fill="#ffffff" fill-opacity=".14"/>
        <text x="68" y="146" fill="#ffffff" font-weight="700">Overview</text>

        <text x="68" y="199" fill="#dfcaec">Restaurants</text>
        <text x="68" y="242" fill="#dfcaec">Orders</text>
        <text x="68" y="285" fill="#dfcaec">Customers</text>
        <text x="68" y="328" fill="#dfcaec">Refunds</text>
        <text x="68" y="371" fill="#dfcaec">Support</text>
        <text x="68" y="414" fill="#dfcaec">Settings</text>
    </g>

    <text x="238" y="74" fill="#291735" font-family="Arial, sans-serif" font-size="25" font-weight="700">
        Operations overview
    </text>

    <text x="238" y="100" fill="#81758a" font-family="Arial, sans-serif" font-size="13">
        Everything that needs your attention today
    </text>

    <g font-family="Arial, sans-serif">
        <g>
            <rect x="238" y="127" width="137" height="94" rx="16" fill="#faf7fc" stroke="#eadff0"/>
            <text x="255" y="153" fill="#82768a" font-size="12">Orders today</text>
            <text x="255" y="190" fill="#3e2052" font-size="28" font-weight="700">1,284</text>
            <text x="255" y="208" fill="#219b76" font-size="11">+12.4%</text>
        </g>

        <g>
            <rect x="391" y="127" width="137" height="94" rx="16" fill="#faf7fc" stroke="#eadff0"/>
            <text x="408" y="153" fill="#82768a" font-size="12">Active partners</text>
            <text x="408" y="190" fill="#3e2052" font-size="28" font-weight="700">148</text>
            <text x="408" y="208" fill="#219b76" font-size="11">6 new today</text>
        </g>

        <g>
            <rect x="544" y="127" width="137" height="94" rx="16" fill="#faf7fc" stroke="#eadff0"/>
            <text x="561" y="153" fill="#82768a" font-size="12">Gross value</text>
            <text x="561" y="190" fill="#3e2052" font-size="25" font-weight="700">₹4.8L</text>
            <text x="561" y="208" fill="#219b76" font-size="11">+8.7%</text>
        </g>

        <g>
            <rect x="697" y="127" width="133" height="94" rx="16" fill="#faf7fc" stroke="#eadff0"/>
            <text x="714" y="153" fill="#82768a" font-size="12">Open issues</text>
            <text x="714" y="190" fill="#3e2052" font-size="28" font-weight="700">23</text>
            <text x="714" y="208" fill="#d05a63" font-size="11">4 urgent</text>
        </g>
    </g>

    <rect x="238" y="243" width="365" height="246" rx="18" fill="#ffffff" stroke="#eadff0"/>
    <text x="260" y="275" fill="#3e2052" font-family="Arial, sans-serif" font-size="16" font-weight="700">
        Order activity
    </text>

    <g stroke="#eee7f2" stroke-width="1">
        <path d="M263 316 H579"/>
        <path d="M263 360 H579"/>
        <path d="M263 404 H579"/>
        <path d="M263 448 H579"/>
    </g>

    <path
        d="M269 421 C310 402 320 356 360 371 C397 384 412 315 453 332 C492 349 505 285 548 300 C565 306 573 287 584 278"
        fill="none"
        stroke="#5b2e78"
        stroke-width="5"
        stroke-linecap="round"
    />

    <path
        d="M269 441 C310 424 329 404 364 414 C405 425 420 376 461 390 C500 403 522 361 584 349"
        fill="none"
        stroke="#59d9b3"
        stroke-width="4"
        stroke-linecap="round"
    />

    <rect x="621" y="243" width="209" height="246" rx="18" fill="#ffffff" stroke="#eadff0"/>
    <text x="643" y="275" fill="#3e2052" font-family="Arial, sans-serif" font-size="16" font-weight="700">
        Live orders
    </text>

    <g font-family="Arial, sans-serif">
        <g>
            <circle cx="650" cy="315" r="8" fill="#59d9b3"/>
            <text x="669" y="313" fill="#422651" font-size="12" font-weight="700">QB-78491</text>
            <text x="669" y="330" fill="#8a7d91" font-size="10">Preparing · ₹628</text>
        </g>

        <path d="M643 350 H808" stroke="#eee7f2"/>

        <g>
            <circle cx="650" cy="377" r="8" fill="#f1bd5e"/>
            <text x="669" y="375" fill="#422651" font-size="12" font-weight="700">QB-78488</text>
            <text x="669" y="392" fill="#8a7d91" font-size="10">Partner assigned · ₹412</text>
        </g>

        <path d="M643 412 H808" stroke="#eee7f2"/>

        <g>
            <circle cx="650" cy="439" r="8" fill="#765095"/>
            <text x="669" y="437" fill="#422651" font-size="12" font-weight="700">QB-78480</text>
            <text x="669" y="454" fill="#8a7d91" font-size="10">Delivered · ₹795</text>
        </g>
    </g>
</svg>
'@

$adminPreviewPath = Join-Path $brandDirectory 'admin-preview.svg'
Set-Content -Path $adminPreviewPath -Value $adminPreviewSvg -Encoding UTF8

Write-Host ''
Write-Host 'QuickBite assets created successfully:' -ForegroundColor Green

Get-ChildItem $assetDirectory -Recurse -File |
    Sort-Object FullName |
    Select-Object FullName, Length |
    Format-Table -AutoSize